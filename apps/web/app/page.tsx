import Footer from "@/components/footer";

import Hero from "@/components/hero";
import { MacbookScrollDemo } from "@/components/landing";

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
