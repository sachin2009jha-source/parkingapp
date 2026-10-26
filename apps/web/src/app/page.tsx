import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-cool items-center justify-center gap-8 bg-neutral-950 px-6 text-white">
      <div className="flex max-w-xl flex-col items-center gap-4 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-neutral-400">
          Parking App
        </p>
        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
          Parking, made simpler
        </h1>

        <p className="max-w-md text-lg leading-8 text-neutral-400">
          Create an account or sign in to access your account
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <Link href="/register" className="rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:bg-neutral-200">
            Create account
          </Link>

          <Link href="/login" className="rounded-lg border border-neutral-700 px-6 py-3 font-semibold transition hover:bg-neutral-900">
            Log in
          </Link>
        </div>
      </div>
    </main>
  )
}