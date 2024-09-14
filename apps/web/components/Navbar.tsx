import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { ModeToggle } from './moon';

const Navbar = () => {
  return (
    <nav className="bg-background shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" passHref>
              <h1 className="text-4xl font-extrabold text-primary cursor-pointer">
                AICODEX
              </h1>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/">
                <span className="text-gray-500 hover:text-primary transition duration-300 cursor-pointer text-lg font-medium">
                  Home
                </span>
              </Link>
              <Link href="/features">
                <span className="text-gray-500 hover:text-primary transition duration-300 cursor-pointer text-lg font-medium">
                  Features
                </span>
              </Link>
              <Link href="/pricing">
                <span className="text-gray-500 hover:text-primary transition duration-300 cursor-pointer text-lg font-medium">
                  Pricing
                </span>
              </Link>
              <Link href="/about">
                <span className="text-gray-500 hover:text-primary transition duration-300 cursor-pointer text-lg font-medium">
                  About
                </span>
              </Link>
            </div>
          </div>

          {/* Login Button */}
          <div className="hidden md:block items-center">
            <Link href="/login"> 
              <Button className="mr-6 hover:bg-primary-dark transition duration-300 px-4 py-2 rounded-lg shadow-md font-medium">
                Login
              </Button>
            </Link>
            <ModeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger Icon */}
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/">
            <span className="block text-gray-500 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium">
              Home
            </span>
          </Link>
          <Link href="/features">
            <span className="block text-gray-500 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium">
              Features
            </span>
          </Link>
          <Link href="/pricing">
            <span className="block text-gray-500 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium">
              Pricing
            </span>
          </Link>
          <Link href="/about">
            <span className="block text-gray-500 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium">
              About
            </span>
          </Link>
          <Link href="/login">
            <span className="block   transition duration-300 px-3 py-2 rounded-md text-base font-medium">
              Login
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
