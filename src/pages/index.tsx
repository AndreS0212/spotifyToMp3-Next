import Head from "next/head";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import Image from "next/image";
import Search from "~/components/Search";
import Gallery from "~/components/Gallery";


export interface Video {
  title: string;
  duration: string;
  channel: string;
  thumbnail: string;
  url: string;
}

export interface SpotifyInfo {
  videos: Video[];
  playlistName: string;
  playlistId: string;
}

export interface SpotifyUrlsInfo {
  playlistId: string;
  urls: string[];
}


export default function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [tiktokInfo, setTiktokInfo] = useState({});
  const user = useUser();
  //info de steam que llega del backend
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  //fetch a la api
  const spotifyMutation = api.spotify.getData.useMutation();
  const spotifyUrlsMutation = api.spotify.getDowloandUrls.useMutation();

  const { data, isLoading, mutate, error } = spotifyMutation;
  const { data: dataUrls, isLoading: isLoadingUrls, mutate: mutateUrls, error: errorUrls } = spotifyUrlsMutation;


  const handleSearch = async () => {
    mutate({
      url: searchValue,
    });
  };
  //si se apreta enter se hace el fetch
  const handleOnKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    } else {
      return;
    }
  };

  const getDownloadUrls = async () => {
    mutateUrls({
      playlistId: data.playlistId,
      videos: data.videos,
      playlistName: data.playlistName
    });
  };

  const downloadVideo = async (index: number) => {
    window.open(dataUrls.urls[index], '_blank');
  };



  return (
    <>
      <Head>
        <title>Spotify to mp3</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col justify-center">
        <Search searchValue={searchValue} handleSearch={handleSearch} handleSearchChange={handleSearchChange} handleOnKeyDown={handleOnKeyDown} />
        {isLoading && <span className="loading mx-auto mt-12 loading-spinner loading-lg"></span>}
        <Gallery data={data} getDownloadUrls={getDownloadUrls} dataUrls={dataUrls} downloadVideo={(index) => downloadVideo(index)} isLoading={isLoadingUrls} />
      </div>
    </>
  );
}
