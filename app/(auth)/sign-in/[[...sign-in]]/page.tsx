import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="p-6 rounded-xl shadow-md bg-white">
        <SignIn appearance={{
          elements: {
            formButtonPrimary: "bg-black text-white hover:bg-gray-800",
            card: "shadow-none",
          }
        }} />
      </div>
    </div>
  )
}
