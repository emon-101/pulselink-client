import Banner from "@/components/homepage/Banner";
import ContactUs from "@/components/homepage/Contactus";
import Featured from "@/components/homepage/Featured";


export default function Home() {
  return (
    <>
      <Banner />
      <Featured />
      <div id="contact">
        <ContactUs />
      </div>
    </>
  );
}