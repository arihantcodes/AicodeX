import React from "react";
import { MacbookScroll } from "../components/mackbook";
import Link from "next/link";

export function MacbookScrollDemo() {
  return (
    <div className="overflow-hidden bg-background w-full">
      <MacbookScroll
        title={<span>Why AICODEX Stands Out</span>}
        badge={<Link href="https://peerlist.io/manuarora"></Link>}
        src={`/linear.webp`}
        showGradient={false}
      />
    </div>
  );
}
