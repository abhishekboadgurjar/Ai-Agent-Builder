import type { Metadata } from "next";
import "./globals.css";
import {Outfit} from 'next/font/google'
import { ConvexClientProvider } from "./ConvexClientProvider";
import {ClerkProvider} from '@clerk/nextjs'
import Provider from "./provider";
import { Toaster } from "@/components/ui/sonner";

const outfit=Outfit({subsets:['latin']})

export const metadata: Metadata = {
  title: "Ai Agent Builder Platform",
  description: "The ap where you can build AI Agent by simply drag and drop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
    className={outfit.className}
      >
 <ConvexClientProvider>

  <Provider>{children}
    <Toaster/>
    </Provider></ConvexClientProvider>
      </body>
    </html>
    </ClerkProvider>

  );
}
