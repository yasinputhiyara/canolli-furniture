import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import MobileBottomNav from "../components/layout/MobileBottomNav";
import "./MainLayout.css";

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
};

export default MainLayout;