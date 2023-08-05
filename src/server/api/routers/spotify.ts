/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import axios from "axios";
import type { SpotifyInfo, SpotifyUrlsInfo, Video } from "~/pages";

interface VideoDb {
  title: string;
  duration: string;
  channel: string;
  youtubeUrl: string;
  thumbnail: string;
}

const SpotifyGetDataRouterInputSchema = z.object({
  url: z.string(),
});

const SpotifyGetDowloandUrlRouterInputSchema = z.object({
  playlistName: z.string(),
  playlistId: z.string(),
  video: z.object({
    title: z.string(),
    duration: z.string(),
    channel: z.string(),
    url: z.string(),
    thumbnail: z.string(),
  }),
});

export const spotifyRouter = createTRPCRouter({
  getData: publicProcedure
    .input(SpotifyGetDataRouterInputSchema)
    .mutation(async (opts) => {
      const { input } = opts;
      const { url } = input;
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${process.env.BACKEND_URL}/spotify`,
        headers: {
          "Content-Type": "application/json",
        },
        data: { url },
      };
      const playlist = await opts.ctx.prisma.playlist.findUnique({
        where: { id: url.split("/playlist/")[1] },
        include: { videos: true },
      });

      if (playlist) {
        const videos: VideoDb[] = playlist.videos;

        const data: SpotifyInfo = {
          playlistName: playlist.name,
          playlistId: playlist.id,
          videos: videos.map((video) => ({
            title: video.title,
            duration: video.duration,
            channel: video.channel,
            url: video.youtubeUrl,
            thumbnail: video.thumbnail,
          })),
        };
        return data;
      }
      const response = await axios.request(config);
      const data: SpotifyInfo = response.data;

      await opts.ctx.prisma.video.createMany({
        data: data.videos.map((video: Video) => ({
          title: video.title,
          duration: video.duration,
          channel: video.channel,
          thumbnail: video.thumbnail,
          youtubeUrl: video.url,
          playlistId: data.playlistId,
        })),
      });

      await opts.ctx.prisma.playlist.create({
        data: {
          name: data.playlistName,
          userId: data.playlistId,
          id: data.playlistId,
          // videos: {
          //   create: data.videos.map((video: Video) => ({
          //     title: video.title,
          //     duration: video.duration,
          //     channel: video.channel,
          //     thumbnail: video.thumbnail,
          //     youtubeUrl: video.url,
          //   })),
          // },
        },
      });

      return data;
    }), // Output transformer is now passed directly to createTRPCRouter
  getDownloadUrl: publicProcedure
    .input(SpotifyGetDowloandUrlRouterInputSchema)
    .mutation(async (opts) => {
      const { input } = opts;
      const { video, playlistId, playlistName } = input;
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${process.env.BACKEND_URL}/download`,
        headers: {
          "Content-Type": "application/json",
        },
        data: { playlistId, playlistName, video },
      };
      const response = await axios.request(config);
      const data: SpotifyUrlsInfo = response.data;
      return data;
    }), // Output transformer is now passed directly to createTRPCRouter
});

export type SpotifyRouter = typeof spotifyRouter;
