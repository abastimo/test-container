import Link from "next/link";

export default function App({ Component, pageProps }) {
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <nav
        data-testid="navbar"
        style={{ display: "flex", gap: "1.5rem", padding: "1rem 2rem", background: "#111827" }}
      >
        <Link href="/microfront" style={{ color: "#93c5fd", textDecoration: "none" }}>
          Microfront
        </Link>
      </nav>
      <Component {...pageProps} />
    </div>
  );
}
