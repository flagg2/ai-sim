"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../../shadcn/button";

export function BackButton() {
  const router = useRouter();

  // scroll restoration wouldnt work with normal link
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 rounded-md border"
      onClick={handleBack}
    >
      <ArrowLeft className="h-4 w-4 transition-all" />
      <span className="sr-only">Go back</span>
    </Button>
  );
}
