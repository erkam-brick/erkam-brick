"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/galeri", label: "Galeri" },
  { href: "/motorlar", label: "Powered UP" },
  { href: "/#games", label: "Oyunlar" },
  { href: "/bilgi", label: "Bilgi Köşesi" },
  { href: "/hakkimda", label: "Hakkımda" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="ERKAM BRICK Logo"
              width={200}
              height={64}
              className="h-16 w-auto object-contain drop-shadow-md hover:scale-105 transition-transform duration-200"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-xl tracking-tight text-foreground">ERKAM</span>
              <span className="font-extrabold text-xl tracking-tight text-lego-red">BRİCK</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 font-medium">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full transition-all text-sm font-semibold ${
                  pathname === link.href
                    ? "bg-foreground text-background"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 z-40 bg-background pt-24 px-6 md:hidden"
        >
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-2xl font-bold py-2 border-b border-zinc-100 dark:border-zinc-800 ${
                  pathname === link.href ? "text-lego-red" : "hover:text-lego-blue"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
}
