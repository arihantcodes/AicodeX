import React from "react";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

export function Shine() {
  return (
    <div className="h-[40rem] bg-background  items-center justify-center hidden md:flex">
      <TextHoverEffect text="AICODEX" />
    </div>
  );
}
