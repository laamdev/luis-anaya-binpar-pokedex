"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { GithubIcon, ArrowLeft } from "lucide-react";

import { Logo } from "@/components/navigation/logo";

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <header className="flex mb-12 max-w-screen-xl mx-auto items-center justify-between h-16">
      {!isHomePage && (
        <button
          onClick={() => router.back()}
          className="size-8 cursor-pointer flex items-center justify-center rounded-full bg-neutral-700 hover:opacity-80 transition-opacity duration-300 ease-in-out"
        >
          <ArrowLeft className="p-1 text-white" />
        </button>
      )}
      {isHomePage && <div className="size-8" />}
      <div className="flex-1 flex justify-center">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <nav>
        <ul className="flex items-center gap-4">
          <li>
            <a
              href="https://github.com/laamdev/luis-anaya-binpar-pokedex"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="size-8 flex items-center justify-center rounded-full bg-neutral-700 hover:opacity-80 transition-opacity duration-300 ease-in-out">
                <GithubIcon className="p-1 text-white" />
              </div>
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};
