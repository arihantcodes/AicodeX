import Link from 'next/link';

import Image from 'next/image';
import { Button } from '@/components/ui/button';


export default function Header() {
  return (
    <nav>
      <div className="mx-auto max-w-7xl relative px-[32px] py-[18px] flex items-center justify-between">
        <div className="flex flex-1 items-center justify-start">
          <Link className="flex items-center font-bold text-lg" href={'/'}>
            AICODEX
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <div className="flex space-x-4">
          
              <Button asChild={true} variant={'secondary'}>
                <Link href={'/signin'}>Sign in</Link>
              </Button>
            
          </div>
        </div>
      </div>
    </nav>
  );
}
