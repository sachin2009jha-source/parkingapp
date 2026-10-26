
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_GRAPHQL_URL!,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              mutation Login($input: LoginCredentialsInput!) {
                loginWithCredentials(input: $input) {
                  accessToken
                  tokenType
                }
              }
            `,
            variables: { input: { email, password } },
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || result.errors?.length) {
        throw new Error(
          result.errors?.[0]?.message ?? "Login failed.",
        );
      }

      const login = result.data?.loginWithCredentials;

      if (!login?.accessToken) {
        throw new Error("The API did not return an access token.");
      }

      sessionStorage.setItem("accessToken", login.accessToken);
      sessionStorage.setItem("tokenType", login.tokenType);

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
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
          <h1 className="pt-3 text-3xl font-bold">Welcome back</h1>
          <p className="text-sm text-neutral-400">
            Sign in to access your account.
          </p>
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
            autoComplete="current-password"
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 outline-none focus:border-white"
            placeholder="Your password"
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
          {loading ? "Signing in..." : "Log in"}
        </button>

        <p className="text-center text-sm text-neutral-400">
          Need an account?{" "}
          <Link
            href="/register"
            className="text-white underline underline-offset-4"
          >
            Register
          </Link>
        </p>
      </form>
    </main>
  );
}
