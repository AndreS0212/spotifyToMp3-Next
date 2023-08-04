import Image from "next/image";
import type { SpotifyInfo, SpotifyUrlsInfo, Video } from "~/pages";

interface Props {
    data: SpotifyInfo | undefined;
    getDownloadUrls: () => void;
    dataUrls: SpotifyUrlsInfo | undefined;
    downloadVideo: (index: number) => void;
    isLoading: boolean;
}
const Gallery = ({ data, getDownloadUrls, downloadVideo, dataUrls, isLoading }: Props) => {
    return (

        <div className="overflow-x-auto mt-3">
            <table className="table">
                {data && (
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>duration</th>
                            <th>Channel</th>
                            <th>Dowloand</th>
                        </tr>
                    </thead>)
                }

                <tbody>
                    {
                        data?.videos?.map((item: Video, index) => {
                            return (
                                <tr key={item.url}>
                                    <td>
                                        <a href={item.url} target="_blank"
                                            rel="noopener noreferrer">

                                            <Image src={item.thumbnail} alt="Spotify Icon" height={50} width={100} />
                                        </a>
                                    </td>
                                    <td>{item.title}</td>
                                    <td>{item.duration}</td>
                                    <td>{item.channel}</td>
                                    <td className="h-[64px] w-[107px]">{isLoading ? <span className="loading loading-spinner loading-sm"></span> : <button className="bg-green-400 p-2 w-[85px]" onClick={!dataUrls ? getDownloadUrls : () => downloadVideo(index)}>{!dataUrls ? 'Get URL' : 'Download'}</button>}</td>
                                </tr>
                            );
                        }
                        )
                    }

                </tbody>
            </table>
        </div>
    )
}

export default Gallery