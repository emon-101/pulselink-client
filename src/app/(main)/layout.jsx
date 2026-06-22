import Footer from "@/components/homepage/Footer";
import Navbar from "@/components/homepage/Navbar";
import { getUserSession } from "@/lib/core/session";


export default async function RootLayout({ children }) {
    const user = await getUserSession();
  return (
    
      <div className="min-h-full flex flex-col ">
          <Navbar user={user} />
          {children}
          <Footer />
      </div>
  );
}