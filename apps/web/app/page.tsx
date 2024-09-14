import Footer from "@/components/footer";
import { BentoDemo } from "@/components/grid";
import Hero from "@/components/hero";
import { MacbookScrollDemo } from "@/components/landing";
import Ripple from "@/components/magicui/ripple";
import { ModeToggle } from "@/components/moon";
import Navbar from "@/components/Navbar";
import { Shine } from "@/components/shine";
import React from "react";

const page = () => {
  return (
    <>
      <Navbar />

      <Hero />
      <MacbookScrollDemo />
      
      <Shine />
      <Footer />
    </>
  );
};

export default page;
