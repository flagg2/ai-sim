"use client";
import { ArrowLeft } from "lucide-react";
import { Button } from "../shadcn/button";
import Link from "next/link";

export function BackButton() {
  return (
    <Link href="/">
      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md border">
        <ArrowLeft className="h-4 w-4 transition-all" />
        <span className="sr-only">Go back</span>
      </Button>
    </Link>
  );
}
