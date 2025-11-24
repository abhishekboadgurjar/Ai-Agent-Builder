"use client";

import React from "react";
import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] py-10">
      <UserProfile
        appearance={{
          elements: {
            card: "shadow-none border rounded-xl p-4",
          },
        }}
      />
    </div>
  );
}
