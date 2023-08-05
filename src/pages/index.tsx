import Head from "next/head";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
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
  url: string;
  youtubeUrl: string;
}

export interface urls {
  youtubeUrl: string;
  url: string;
}


export default function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [urls, setUrls] = useState<urls[]>([
  ]);
  //info de steam que llega del backend
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  //fetch a la api
  const spotifyMutation = api.spotify.getData.useMutation();
  const spotifyUrlMutation = api.spotify.getDownloadUrl.useMutation();

  const { data, isLoading, mutate } = spotifyMutation;
  const { data: dataUrls, isLoading: isLoadingUrls, mutate: mutateUrls } = spotifyUrlMutation;

  useEffect(() => {
    if (dataUrls) {
      setUrls((prevUrls) => [
        ...prevUrls,
        {
          youtubeUrl: dataUrls.youtubeUrl,
          url: dataUrls.url,
        },
      ]);
    }
  }, [dataUrls, setUrls]);


  const handleSearch = () => {
    mutate({
      url: searchValue,
    });
  };
  //si se apreta enter se hace el fetch
  const handleOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    } else {
      return;
    }
  };

  const getDownloadUrls = (url: string) => {
    if (!data?.videos) return;
    mutateUrls({
      playlistId: data.playlistId,
      playlistName: data.playlistName,
      video: data.videos.find((item: Video) => item.url === url)!
    })
  };

  const downloadVideo = (youtubeUrl: string) => {
    const url = urls?.find((item) => item.youtubeUrl === youtubeUrl)?.url;
    window.open(url, '_blank');
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
        <Gallery data={data} getDownloadUrls={getDownloadUrls} urls={urls} downloadVideo={(index) => downloadVideo(index)} isLoading={isLoadingUrls} />
      </div>
    </>
  );
}
