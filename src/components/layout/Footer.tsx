import Link from "next/link";
import { Leaf, Mail, Phone, Globe, MessageCircle, Camera } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-green-500" />
              <span className="text-lg font-bold text-white">EcoSpark Hub</span>
            </div>
            <p className="text-sm text-gray-400">
              Empowering communities to share and implement sustainable ideas
              for a greener future.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Quick Links
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-sm hover:text-green-400 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/ideas"
                className="text-sm hover:text-green-400 transition-colors"
              >
                Browse Ideas
              </Link>
              <Link
                href="/about"
                className="text-sm hover:text-green-400 transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/blog"
                className="text-sm hover:text-green-400 transition-colors"
              >
                Blog
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Legal
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                href="#"
                className="text-sm hover:text-green-400 transition-colors"
              >
                Terms of Use
              </Link>
              <Link
                href="#"
                className="text-sm hover:text-green-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm hover:text-green-400 transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Contact Us
            </h3>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:contact@ecosparkhub.com"
                className="flex items-center gap-2 text-sm hover:text-green-400 transition-colors"
              >
                <Mail className="h-4 w-4" />
                contact@ecosparkhub.com
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-2 text-sm hover:text-green-400 transition-colors"
              >
                <Phone className="h-4 w-4" />
                +1 (234) 567-890
              </a>
            </div>
            <div className="flex gap-3 mt-2">
              <a
                href="#"
                className="hover:text-green-400 transition-colors"
                aria-label="Facebook"
              >
                <Globe className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="hover:text-green-400 transition-colors"
                aria-label="Twitter"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="hover:text-green-400 transition-colors"
                aria-label="Instagram"
              >
                <Camera className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />

        <div className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} EcoSpark Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
