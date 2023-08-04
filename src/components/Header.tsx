import Image from "next/image"
import AuthButtons from "./AuthButtons"

const Header = () => {
    return (
        <header className="flex flex-row justify-between bg-black text-white p-2">
            <div className="flex flex-row items-center gap-2">
                <Image src="/spotify-icon.png" width={40} height={40} alt="spotify icon" />
                <h1 className="text-2xl font-bold">Spotify to mp3</h1>
            </div>
            <AuthButtons />

        </header>
    )
}

export default Header