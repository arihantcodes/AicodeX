import Image from 'next/image'
import Link from 'next/link'
import { CupSoda, Heart } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function LocalizationBanner() {
  const buyMeACoffeeUrl = "https://www.buymeacoffee.com/arihantcodes"
  const supporterCount = 42 // Replace with actual count or fetch dynamically

  return (
    <div className="border-border/50 border-b-2 bg-background">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center py-2 px-4 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Heart className="h-5 w-5 text-red-500 animate-pulse" />
          <span className="text-sm text-muted-foreground">
            {supporterCount} amazing supporters
          </span>
        </div>
        <Link href={buyMeACoffeeUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" className="flex items-center space-x-2 hover:bg-primary/10 transition-colors duration-300">
            <CupSoda className="h-5 w-5 text-primary" />
            <span className="font-medium">Buy Me a Coffee</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}