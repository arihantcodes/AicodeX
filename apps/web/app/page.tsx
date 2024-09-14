import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Code, Globe, Zap, Laptop, Users, Sparkles } from "lucide-react"
import Link from "next/link"

export default function AicodeXLanding() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-gray-800">
        <Link className="flex items-center justify-center" href="#">
          <Sparkles className="h-6 w-6 mr-2 text-blue-500" />
          <span className="font-bold text-xl">AicodeX</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-blue-400" href="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-blue-400" href="#">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:text-blue-400" href="#">
            Blog
          </Link>
          <Link className="text-sm font-medium hover:text-blue-400" href="#">
            Documentation
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  AI-Powered Coding, Unleashed
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl dark:text-gray-400">
                  Experience the future of development with AicodeX. Code smarter, faster, and more efficiently with AI assistance.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-blue-600 text-white hover:bg-blue-700">Get Started</Button>
                <Button variant="outline" className="text-blue-400 border-blue-400 hover:bg-blue-400/10">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Features</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-3 text-center">
                <Code className="h-12 w-12 text-blue-500" />
                <h3 className="text-xl font-bold">AI Code Completion</h3>
                <p className="text-gray-400">Intelligent code suggestions powered by advanced AI models.</p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <Globe className="h-12 w-12 text-blue-500" />
                <h3 className="text-xl font-bold">Cloud-Based IDE</h3>
                <p className="text-gray-400">Access your development environment from anywhere, anytime.</p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <Users className="h-12 w-12 text-blue-500" />
                <h3 className="text-xl font-bold">Collaborative Coding</h3>
                <p className="text-gray-400">Real-time collaboration with team members, enhanced by AI insights.</p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <Zap className="h-12 w-12 text-blue-500" />
                <h3 className="text-xl font-bold">Instant AI Debugging</h3>
                <p className="text-gray-400">Quickly identify and fix bugs with AI-powered debugging tools.</p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <Laptop className="h-12 w-12 text-blue-500" />
                <h3 className="text-xl font-bold">Multi-Language Support</h3>
                <p className="text-gray-400">AI assistance for a wide range of programming languages and frameworks.</p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <Sparkles className="h-12 w-12 text-blue-500" />
                <h3 className="text-xl font-bold">AI Code Optimization</h3>
                <p className="text-gray-400">Automatically optimize your code for better performance and readability.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Pricing Plans</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                <h3 className="text-2xl font-bold text-center mb-4">Starter</h3>
                <p className="text-4xl font-bold text-center mb-4 text-blue-400">$0<span className="text-sm font-normal">/month</span></p>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Basic AI code completion
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    1 GB Cloud Storage
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Community Support
                  </li>
                </ul>
                <Button className="mt-auto bg-blue-600 text-white hover:bg-blue-700">Get Started</Button>
              </div>
              <div className="flex flex-col p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                <h3 className="text-2xl font-bold text-center mb-4">Pro</h3>
                <p className="text-4xl font-bold text-center mb-4 text-blue-400">$29<span className="text-sm font-normal">/month</span></p>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Advanced AI code completion
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    50 GB Cloud Storage
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Priority Support
                  </li>
                </ul>
                <Button className="mt-auto bg-blue-600 text-white hover:bg-blue-700">Upgrade to Pro</Button>
              </div>
              <div className="flex flex-col p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                <h3 className="text-2xl font-bold text-center mb-4">Enterprise</h3>
                <p className="text-4xl font-bold text-center mb-4 text-blue-400">Custom</p>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Custom AI models
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Unlimited Cloud Storage
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    24/7 Dedicated Support
                  </li>
                </ul>
                <Button className="mt-auto bg-blue-600 text-white hover:bg-blue-700">Contact Sales</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Code Smarter?</h2>
                <p className="max-w-[600px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of developers who are already using AicodeX to revolutionize their coding experience.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input className="max-w-lg flex-1 bg-gray-700 border-gray-600 text-white" placeholder="Enter your email" type="email" />
                  <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Get Started</Button>
                </form>
                <p className="text-xs text-gray-400">
                  By signing up, you agree to our{" "}
                  <Link className="underline underline-offset-2 hover:text-blue-400" href="#">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-xs text-gray-400">© 2023 AicodeX Inc. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-blue-400" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-blue-400" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}