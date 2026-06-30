import { useStore } from "@/store/useStore";
import { formatFollowers } from "@/utils/formatters";
import { getPlatformColor, getPlatformLabel } from "@/utils/dataHelpers";
import { VerifiedBadge } from "./VerifiedBadge";
import type { Platform } from "@/types";

export function SavedList() {
  const { savedList, removeFromList, setListOpen } = useStore();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setListOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 100,
        }}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="animate-slide-in"
        role="dialog"
        aria-label="Saved profiles list"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 380,
          maxWidth: "100vw",
          background: "var(--bg-surface)",
          borderLeft: "1px solid var(--border-subtle)",
          zIndex: 101,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            background: "var(--bg-surface)",
            zIndex: 1,
          }}
        >
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)" }}>
              My List
            </h2>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
              {savedList.length === 0
                ? "No profiles saved yet"
                : `${savedList.length} profile${savedList.length !== 1 ? "s" : ""} saved`}
            </p>
          </div>
          <button
            onClick={() => setListOpen(false)}
            aria-label="Close list"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "1px solid var(--border-subtle)",
              background: "transparent",
              color: "var(--text-secondary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            ×
          </button>
        </div>

        {/* List content */}
        <div style={{ flex: 1, padding: 16 }}>
          {savedList.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 24px",
                color: "var(--text-muted)",
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
              <p style={{ fontSize: 14 }}>
                Browse influencers and click "Add to List" to save them here.
              </p>
            </div>
          ) : (
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {savedList.map(({ profile, platform }) => (
                <li
                  key={profile.user_id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    borderRadius: 12,
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <img
                    src={profile.picture}
                    alt={profile.fullname}
                    style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullname)}&background=7c3aed&color=fff`; }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        @{profile.username}
                      </span>
                      <VerifiedBadge verified={profile.is_verified} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          padding: "2px 6px",
                          borderRadius: 4,
                          color: getPlatformColor(platform as Platform),
                          background: `${getPlatformColor(platform as Platform)}22`,
                        }}
                      >
                        {getPlatformLabel(platform as Platform)}
                      </span>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        {formatFollowers(profile.followers)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromList(profile.user_id)}
                    aria-label={`Remove ${profile.username} from list`}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      border: "1px solid rgba(239,68,68,0.3)",
                      background: "rgba(239,68,68,0.08)",
                      color: "#ef4444",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      flexShrink: 0,
                      transition: "all 0.15s ease",
                    }}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
