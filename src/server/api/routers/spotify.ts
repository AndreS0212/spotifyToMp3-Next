import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import axios from "axios";
import { env } from "~/env.mjs";
import type { SpotifyInfo, SpotifyUrlsInfo } from "~/pages";

const SpotifyGetDataRouterInputSchema = z.object({
  url: z.string(),
});

const SpotifyGetDowloandUrlRouterInputSchema = z.object({
  playlistName: z.string(),
  playlistId: z.string(),
  videos: z.array(
    z.object({
      title: z.string(),
      duration: z.string(),
      channel: z.string(),
      url: z.string(),
      thumbnail: z.string(),
    })
  ),
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
        url: `${env.BACKEND_URL}/spotify`,
        headers: {
          "Content-Type": "application/json",
        },
        data: { url },
      };
      const response = await axios.request(config);
      const data: SpotifyInfo = response.data;
      return data;
    }), // Output transformer is now passed directly to createTRPCRouter
  getDowloandUrls: publicProcedure
    .input(SpotifyGetDowloandUrlRouterInputSchema)
    .mutation(async (opts) => {
      const { input } = opts;
      const { videos, playlistId, playlistName } = input;
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${env.BACKEND_URL}/download`,
        headers: {
          "Content-Type": "application/json",
        },
        data: { playlistId, playlistName, videos },
      };
      const response = await axios.request(config);
      const data: SpotifyUrlsInfo = response.data;
      return data;
    }), // Output transformer is now passed directly to createTRPCRouter
});

export type SpotifyRouter = typeof spotifyRouter;
