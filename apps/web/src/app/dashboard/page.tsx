
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  uid: string;
  name?: string | null;
  email: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      const token = sessionStorage.getItem("accessToken");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_GRAPHQL_URL!,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              query: `
                query ProtectedUsers {
                  users {
                    uid
                    name
                  }
                }
              `,
            }),
          },
        );

        const result = await response.json();

        if (response.status === 401 ||
            result.errors?.some((item: { extensions?: { code?: string } }) =>
              item.extensions?.code === "UNAUTHENTICATED"
            )) {
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("tokenType");
          router.replace("/login");
          return;
        }

        if (!response.ok || result.errors?.length) {
          throw new Error(
            result.errors?.[0]?.message ?? "Could not load protected data.",
          );
        }

        if (!cancelled) {
          setUsers(result.data?.users ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Request failed.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadUsers();

    return () => {
      cancelled = true;
    };
  }, [router]);

  function logout() {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("tokenType");
    router.replace("/login");
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-widest text-neutral-500">
              Parking App
            </p>
            <h1 className="mt-2 text-3xl font-bold">Dashboard</h1>
          </div>

          <button
            onClick={logout}
            className="rounded-lg border border-neutral-700 px-4 py-2 hover:bg-neutral-900"
          >
            Log out
          </button>
        </header>

        <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="text-xl font-semibold">Protected user data</h2>
          <p className="mt-2 text-sm text-neutral-400">
            This data is fetched from the GraphQL API using your JWT.
          </p>

          {loading && (
            <p className="mt-6 text-neutral-400">Loading protected data...</p>
          )}

          {error && (
            <div className="mt-6 space-y-3">
              <p role="alert" className="text-red-400">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="mt-6 space-y-3">
              {users.length === 0 ? (
                <p className="text-neutral-400">
                  The API returned no users.
                </p>
              ) : (
                users.map((user) => (
                  <article
                    key={user.uid}
                    className="rounded-lg border border-neutral-800 p-4"
                  >
                    <p className="font-medium">{user.name || "Unnamed user"}</p>
                    <p className="mt-1 text-sm text-neutral-400">
                      {user.email}
                    </p>
                  </article>
                ))
              )}
            </div>
          )}
        </section>

        <Link
          href="/"
          className="inline-block text-sm text-neutral-400 underline underline-offset-4 hover:text-white"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
