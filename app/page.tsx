import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import WhyUs from "@/components/sections/WhyUs";
import Portfolio from "@/components/sections/Portfolio";
import Testimonials from "@/components/sections/Testimonials";
import Process from "@/components/sections/Process";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <WhyUs />
      <Portfolio />
      <Testimonials />
      <Process />
      <FAQ />
      <Contact />
    </>
  );
}
