"use client";

import { registry } from "@repo/algorithms/impl";
import { SearchBox, ThemeToggle } from "@repo/ui/components";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
  const [hits, setHits] = useState<typeof registry>(registry);

  return (
    <div className="w-full">
      <ThemeToggle className="fixed top-0 right-0 m-4" />
      <section className="pt-8 md:pt-12 lg:pt-20 pb-6 md:pb-12">
        <div className="container px-4 mx-auto md:px-6">
          <div className="max-w-3xl mx-auto text-center gap-4 flex flex-col">
            <h1 className="text-xl font-bold tracking-tight md:text-3xl">
              AI Algorithm Visualizations
            </h1>
            <p className="text-sm text-muted-foreground md:text-lg">
              Select and algorithm to explore its visualization.
            </p>
            <SearchBox
              items={registry}
              keys={["title", "synonyms"]}
              onResults={setHits}
            />
          </div>
        </div>
      </section>
      <section className="pb-6 md:pb-12 max-h-[calc(100vh-10rem)] overflow-auto">
        <div className="container grid gap-8 px-4 mx-auto md:grid-cols-2 lg:grid-cols-3 md:px-6">
          {hits.map((viz, index) => (
            <Link
              key={index}
              href={viz.slug}
              className="relative overflow-hidden rounded-lg shadow-lg group lg:hover:shadow-xl lg:hover:-translate-y-2 transition-all duration-300 border border-primary"
              prefetch={false}
            >
              <div className="w-full h-32 lg:h-56 dark:bg-[#050505] bg-[#F6F6F6] relative">
                <Image
                  layout="fill"
                  src={viz.image.paths.light}
                  alt={viz.image.alt}
                  className="block dark:hidden object-contain w-full h-32 lg:h-56 group-hover:opacity-50 transition-opacity "
                />
                <Image
                  layout="fill"
                  src={viz.image.paths.dark}
                  alt={viz.image.alt}
                  className="dark:block hidden object-contain w-full h-32 lg:h-56 group-hover:opacity-50 transition-opacity "
                />
              </div>

              <div className="py-6 bg-card inset-0 z-10 flex items-center justify-center">
                <div className="text-center text-card-foreground">
                  <h3 className="text-lg md:text-xl font-bold">{viz.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {viz.shortDescription}
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
