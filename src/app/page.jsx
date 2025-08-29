
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CTA from "@/components/CTA";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <Features />
      <CTA />
      <Testimonials />
      <Footer />
    </div>
  );
}
