import Footer from "./Footer";
import Header from "./Header";
interface Props {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
    return (
        <>
            <Header />
            <main className="flex flex-col min-h-screen px-6 py-2 ">{children}</main>
            <Footer />
        </>
    );
}

export default Layout;