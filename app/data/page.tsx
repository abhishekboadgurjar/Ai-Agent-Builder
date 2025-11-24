"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DataShowcasePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <h1 className="text-3xl font-bold mb-3">Data</h1>
      <p className="text-gray-600 max-w-md">
        View, analyze, and manage all your AI agent data securely in one place.
      </p>

      <Button
        className="mt-6"
        onClick={() => router.push("/dashboard")}
      >
        Go to Dashboard
      </Button>
    </div>
  );
}
