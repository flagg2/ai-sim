"use client";

import { SearchBox, ThemeToggle } from "@repo/ui/components";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { links } from "~/const/links";
// import xgboost from "@repo/ui/public/xgboost.png";

export default function Page() {
  const [hits, setHits] = useState<typeof links>(links);

  return (
    <div className="w-full">
      <ThemeToggle className="fixed top-0 right-0 m-4" />
      <section className="pt-8 md:pt-12 lg:pt-20">
        <div className="container px-4 mx-auto md:px-6">
          <div className="max-w-3xl mx-auto text-center gap-4 flex flex-col">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              AI Algorithm Visualizations
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Select and algorithm to explore its visualization.
            </p>
            <SearchBox
              items={links}
              keys={["title", "synonyms"]}
              onResults={setHits}
            />
          </div>
        </div>
      </section>
      <section className="py-12 ">
        <div className="container grid gap-8 px-4 mx-auto md:grid-cols-2 lg:grid-cols-3 md:px-6">
          {hits.map((viz, index) => (
            <Link
              key={index}
              href={viz.href}
              className="relative overflow-hidden rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-primary"
              prefetch={false}
            >
              <div className="w-full h-56 bg-black">
                <Image
                  src={viz.src}
                  alt={viz.alt}
                  className="object-contain w-full h-56 group-hover:opacity-50 transition-opacity"
                />
              </div>
              <div className="py-6 bg-card inset-0 z-10 flex items-center justify-center">
                <div className="text-center text-card-foreground">
                  <h3 className="text-xl font-bold">{viz.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {viz.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
