import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel, getPlatformColor } from "@/utils/dataHelpers";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const PlatformIcon = ({ platform }: { platform: Platform }) => {
  if (platform === "instagram") return <span aria-hidden="true">📸</span>;
  if (platform === "youtube") return <span aria-hidden="true">▶</span>;
  return <span aria-hidden="true">♪</span>;
};

export function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  return (
    <div style={{ marginBottom: 28 }}>
      {/* Platform tabs */}
      <div
        role="tablist"
        aria-label="Select platform"
        style={{
          display: "inline-flex",
          background: "var(--bg-surface)",
          borderRadius: 12,
          padding: 4,
          gap: 2,
          border: "1px solid var(--border-subtle)",
          marginBottom: 20,
        }}
      >
        {PLATFORMS.map((p) => {
          const isActive = selected === p;
          const color = getPlatformColor(p);
          return (
            <button
              key={p}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(p)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 18px",
                borderRadius: 9,
                border: "none",
                fontWeight: isActive ? 700 : 500,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.18s ease",
                background: isActive
                  ? `linear-gradient(135deg, ${color}33, ${color}22)`
                  : "transparent",
                color: isActive ? color : "var(--text-muted)",
                boxShadow: isActive ? `0 0 0 1px ${color}55` : "none",
              }}
            >
              <PlatformIcon platform={p} />
              {getPlatformLabel(p)}
            </button>
          );
        })}
      </div>

      {/* Search input */}
      <div style={{ position: "relative", maxWidth: 460 }}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-muted)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by username or name…"
          aria-label="Search influencers"
          style={{
            width: "100%",
            padding: "11px 14px 11px 42px",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 10,
            color: "var(--text-primary)",
            fontSize: 14,
            outline: "none",
            transition: "border-color 0.15s ease",
          }}
          onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; }}
          onBlur={(e) => { e.target.style.borderColor = "var(--border-subtle)"; }}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
            }}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
