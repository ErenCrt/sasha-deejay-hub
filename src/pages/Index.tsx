import { Hero } from "@/components/Hero";
import { RecentUploads } from "@/components/RecentUploads";
import { LatestAlbum } from "@/components/LatestAlbum";
import { About } from "@/components/About";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <LatestAlbum />
      <RecentUploads />
      <About />
      <Footer />
    </main>
  );
};

export default Index;
