
import BeautyAssistant from "@/components/assistant/BeautyAssistant";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const BeautyAssistantPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-youorganic-cream/30">
        <BeautyAssistant />
      </main>
      <Footer />
    </div>
  );
};

export default BeautyAssistantPage;
