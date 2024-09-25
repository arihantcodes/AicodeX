'use client';

import { useState } from 'react';


import "@/styles/home-page.css";
import { LocalizationBanner } from '@/components/home/header/localization-banner';
import Header from '@/components/home/header/header';
import { HeroSection } from '@/components/home/hero-section/hero-section';
import { Pricing } from '@/components/home/pricing/pricing';
import { HomePageBackground } from '@/components/gradients/home-page-background';
import { BuiltUsingTools } from './home/buildby';


export function HomePage() {

  const [country, setCountry] = useState('US');

  return (
    <>
      <LocalizationBanner country={country} onCountryChange={setCountry} />
      <div>
        <HomePageBackground />
        <Header  />
        <HeroSection />
        <Pricing country={country} />
        <BuiltUsingTools/>
      </div>
    </>
  );
}