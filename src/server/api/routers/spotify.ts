import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import axios from "axios";
import { env } from "~/env.mjs";

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
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${env.BACKEND_URL}/spotify`,
        headers: {
          "Content-Type": "application/json",
        },
        data: { url },
      };
      const { data } = await axios.request(config);
      return data;
    }), // Output transformer is now passed directly to createTRPCRouter
  getDowloandUrls: publicProcedure
    .input(SpotifyGetDowloandUrlRouterInputSchema)
    .mutation(async (opts) => {
      const { input } = opts;
      const { videos, playlistId, playlistName } = input;
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${env.BACKEND_URL}/download`,
        headers: {
          "Content-Type": "application/json",
        },
        data: { playlistId, playlistName, videos },
      };
      const { data } = await axios.request(config);
      return data;
    }), // Output transformer is now passed directly to createTRPCRouter
});

export type SpotifyRouter = typeof spotifyRouter;
