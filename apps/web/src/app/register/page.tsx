"use client";

import Link from "next/link"
import { FormEvent,  useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setLoading(true)

        try {
            const response = await fetch(
                process.env.NEXT_PUBLIC_GRAPHQL_URL!,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        query: `
                            mutation Register($input: RegisterCredentialsInput!) {
                                registerWithCredentials(input: $input) {
                                    uid
                                    name
                                }
                            }
                        `,
                        variables: {
                            input: {
                                email,
                                password,
                                ...(name.trim() ? { name: name.trim() } : {})
                            }
                        }
                    })
                }
            );
            const result = await response.json()

            if(!response.ok || result.errors?.length) {
                throw new Error(
                    result.errors?.[0]?.message ?? "Registration failed",
                )
            }
            router.push("/login?registered=1")
        } catch (err) {
            setError(
                err instanceof Error
                ? err.message
                : "Something went wrong. Please try again"
            )
        } finally {
            setLoading(false);
        }
    }

    return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 py-12 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-8"
      >
        <div className="space-y-2">
          <Link href="/" className="text-sm text-neutral-400 hover:text-white">
            ← Home
          </Link>
          <h1 className="pt-3 text-3xl font-bold">Create your account</h1>
          <p className="text-sm text-neutral-400">
            Register with your email and password.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Name <span className="text-neutral-500">(optional)</span>
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 outline-none focus:border-white"
            placeholder="Your name"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 outline-none focus:border-white"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 outline-none focus:border-white"
            placeholder="At least 8 characters"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-white px-4 py-3 font-semibold text-black hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="text-center text-sm text-neutral-400">
          Already registered?{" "}
          <Link href="/login" className="text-white underline underline-offset-4">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}