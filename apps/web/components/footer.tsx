import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className=" bg-background py-12 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Logo and copyright section */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center mr-2">
              <span className="text-primary font-bold text-xl">A</span>
            </div>
            <span className="font-bold text-2xl">AICODEX</span>
          </div>
          <p className=" text-sm">© AICODEX 2024. All rights reserved.</p>
        </div>

        {/* Pages Section */}
        <div>
          <h3 className="font-semibold mb-4">Pages</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/products">
                <span className="">All Products</span>
              </Link>
            </li>
            <li>
              <Link href="/studio">
                <span className="">Studio</span>
              </Link>
            </li>
            <li>
              <Link href="/clients">
                <span className="">Clients</span>
              </Link>
            </li>
            <li>
              <Link href="/pricing">
                <span className="">Pricing</span>
              </Link>
            </li>
            <li>
              <Link href="/blog">
                <span className="">Blog</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Socials Section */}
        <div>
          <h3 className="font-semibold mb-4">Socials</h3>
          <ul className="space-y-2">
            <li>
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <span className=" hover:text-white flex items-center cursor-pointer">
                  <Facebook className="w-4 h-4 mr-2" /> Facebook
                </span>
              </Link>
            </li>
            <li>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <span className=" hover:text-white flex items-center cursor-pointer">
                  <Instagram className="w-4 h-4 mr-2" /> Instagram
                </span>
              </Link>
            </li>
            <li>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <span className=" hover:text-white flex items-center cursor-pointer">
                  <Twitter className="w-4 h-4 mr-2" /> Twitter
                </span>
              </Link>
            </li>
            <li>
              <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <span className=" hover:text-white flex items-center cursor-pointer">
                  <Linkedin className="w-4 h-4 mr-2" /> LinkedIn
                </span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal Section */}
        <div>
          <h3 className="font-semibold mb-4">Legal</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/privacy-policy">
                <span className="">Privacy Policy</span>
              </Link>
            </li>
            <li>
              <Link href="/terms-of-service">
                <span className="">Terms of Service</span>
              </Link>
            </li>
            <li>
              <Link href="/cookie-policy">
                <span className="">Cookie Policy</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

     
    </footer>
  );
}
