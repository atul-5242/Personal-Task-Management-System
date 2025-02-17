'use client'

import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  if (!session) {
    return <p>You are not signed in.</p>;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome, {session?.user?.email ?? 'User'}</h1>
      <button
        onClick={() => signOut()}
        style={{ padding: "10px 20px", margin: "10px", cursor: "pointer" }}
      >
        Sign Out
      </button>
    </div>
  );
}