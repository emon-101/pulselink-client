import Footer from "@/components/homepage/Footer";
import Navbar from "@/components/homepage/Navbar";


export default function RootLayout({ children }) {
    const user = null;
  return (
    
      <div className="min-h-full flex flex-col ">
          <Navbar user={user} />
          {children}
          <Footer />
      </div>
  );
}