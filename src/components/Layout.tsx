import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { SavedList } from "./SavedList";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { savedList, toggleList, isListOpen } = useStore();
  const count = savedList.length;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(8, 6, 22, 0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border-subtle)",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 60,
          }}
        >
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg, var(--accent), var(--accent-light))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            >
              ✦
            </div>
            <span
              style={{
                fontWeight: 700,
                fontSize: 17,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
              }}
            >
              Wobb
            </span>
            <span
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                fontWeight: 500,
                marginLeft: -4,
              }}
            >
              Discover
            </span>
          </Link>

          <button
            onClick={toggleList}
            aria-label={`Saved list (${count} profiles)`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              borderRadius: 20,
              border: count > 0 ? "1px solid var(--accent)" : "1px solid var(--border-subtle)",
              background: count > 0 ? "var(--accent-glow)" : "transparent",
              color: count > 0 ? "var(--accent-light)" : "var(--text-muted)",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              transition: "all 0.2s ease",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="1"/>
            </svg>
            My List
            {count > 0 && (
              <span
                style={{
                  background: "var(--accent)",
                  color: "white",
                  borderRadius: 10,
                  padding: "1px 7px",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {count}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, padding: "32px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>{children}</div>
      </main>

      {/* Saved List Drawer */}
      {isListOpen && <SavedList />}
    </div>
  );
}
