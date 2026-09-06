import { Hero } from "@/components/hero/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Services } from "@/components/services/Services";
import { Stack } from "@/components/sections/Stack";
import { Studio } from "@/components/sections/Studio";
import { Portfolio } from "@/components/portfolio/Portfolio";
import { Contact } from "@/components/contact/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Page() {
  return (
    <>
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Stack />
        <Studio />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
