import Footer from "./Footer";
import Header from "./Header";
interface Props {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
    return (
        <div className="bg-black ">
            <Header />
            <main className="flex flex-col px-6 py-2 h-[87vh]">{children}</main>
            <Footer />
        </div>
    );
}

export default Layout;