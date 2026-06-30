import { useMemo } from "react";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { extractProfiles, filterProfiles, getPlatformColor, getPlatformLabel } from "@/utils/dataHelpers";
import { useStore } from "@/store/useStore";

export function SearchPage() {
  const { platform, setPlatform, searchQuery, setSearchQuery } = useStore();

  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);
  const filtered = useMemo(
    () => filterProfiles(allProfiles, searchQuery),
    [allProfiles, searchQuery]
  );

  const platformColor = getPlatformColor(platform);

  return (
    <Layout>
      {/* Hero section */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--accent-light)",
              padding: "3px 10px",
              background: "var(--accent-glow)",
              borderRadius: 20,
              border: "1px solid var(--accent)",
            }}
          >
            Influencer Discovery
          </span>
        </div>
        <h1
          style={{
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: 800,
            color: "var(--text-primary)",
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
          }}
        >
          Find the right creators
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", marginTop: 6 }}>
          Browse top influencers across Instagram, YouTube, and TikTok
        </p>
      </div>

      <PlatformFilter
        selected={platform}
        onChange={setPlatform}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Results count */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
          {searchQuery ? (
            <>
              <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
                {filtered.length}
              </span>{" "}
              result{filtered.length !== 1 ? "s" : ""} for "{searchQuery}" on{" "}
              <span style={{ color: platformColor }}>{getPlatformLabel(platform)}</span>
            </>
          ) : (
            <>
              Showing{" "}
              <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
                {filtered.length}
              </span>{" "}
              creators on{" "}
              <span style={{ color: platformColor }}>{getPlatformLabel(platform)}</span>
            </>
          )}
        </p>
      </div>

      <ProfileList profiles={filtered} platform={platform} />
    </Layout>
  );
}
