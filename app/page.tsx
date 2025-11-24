"use client"

import Link from 'next/link'
import { useUser, UserButton } from '@clerk/nextjs'

export default function HomePage() {
  const { isSignedIn } = useUser()
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">BuildMyAiAgent</h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-8">
            Create, test, and deploy custom AI agents with an intuitive visual builder.
            Connect APIs, design workflows, and iterate quickly — no boilerplate required.
          </p>
          {isSignedIn ? (
            <div className="flex justify-center gap-4 items-center">
              <UserButton afterSignOutUrl="/" />
              <Link href="/dashboard" className="inline-block rounded-md bg-slate-900 text-white px-6 py-3 font-medium hover:opacity-95">
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="flex justify-center gap-4">
              <Link href="/sign-up" className="inline-block rounded-md bg-slate-900 text-white px-6 py-3 font-medium hover:opacity-95">
                Sign up
              </Link>
              <Link href="/sign-in" className="inline-block rounded-md border border-slate-200 px-6 py-3 text-slate-900 hover:bg-slate-100">
                Log in
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto grid gap-8 sm:grid-cols-3">
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-2">Visual Workflow Editor</h3>
              <p className="text-sm text-slate-600">Drag, connect, and configure nodes to design agent behavior visually.</p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-2">Integrations</h3>
              <p className="text-sm text-slate-600">Call external APIs, store results, and orchestrate multi-step tasks.</p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-2">Preview & Test</h3>
              <p className="text-sm text-slate-600">Run interactive previews to validate agent flows and iterate faster.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">How it works</h2>
          <ol className="text-left list-decimal list-inside space-y-3 text-slate-600">
            <li>Design your agent using the visual editor.</li>
            <li>Configure API calls, conditions, and actions with node settings.</li>
            <li>Preview, test, and deploy your agent to start automating tasks.</li>
          </ol>
        </div>
      </section>

      <footer className="border-t bg-slate-50 py-8">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between">
          <div className="text-sm text-slate-600">© {new Date().getFullYear()} BuildMyAiAgent</div>
        </div>
      </footer>
    </main>
  )
}
