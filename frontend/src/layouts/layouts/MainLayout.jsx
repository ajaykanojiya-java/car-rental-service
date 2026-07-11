import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

function MainLayout({ children }) {
    return (
        <>
            <Header />
            <main>
                {children}
            </main>
            <Footer />
        </>
    );
}
export default MainLayout;