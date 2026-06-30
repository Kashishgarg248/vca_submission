import { useEffect, useState, useCallback } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, ProfileDetailResponse, Platform } from "@/types";
import { formatFollowers, formatEngagementRate, formatNumber } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useStore } from "@/store/useStore";
import { getPlatformColor, getPlatformLabel } from "@/utils/dataHelpers";

interface StatCardProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function StatCard({ label, value, highlight }: StatCardProps) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: 12,
        padding: "14px 18px",
      }}
    >
      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: highlight ? "#10b981" : "var(--text-primary)",
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = (searchParams.get("platform") || "instagram") as Platform;

  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { addToList, removeFromList, isInList } = useStore();

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setError(false);
    loadProfileByUsername(username)
      .then((data) => {
        setProfileData(data);
        if (!data) setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [username]);

  const platformColor = getPlatformColor(platform);

  if (!username) {
    return (
      <Layout>
        <p style={{ color: "var(--text-muted)" }}>Invalid profile URL.</p>
        <Link to="/" style={{ color: "var(--accent-light)", marginTop: 12, display: "inline-block" }}>
          ← Back to search
        </Link>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-muted)", padding: "60px 0" }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              border: "2px solid var(--accent)",
              borderTopColor: "transparent",
              animation: "spin 0.6s linear infinite",
            }}
          />
          Loading @{username}…
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </Layout>
    );
  }

  if (error || !profileData) {
    return (
      <Layout>
        <div
          style={{
            textAlign: "center",
            padding: "60px 24px",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>😕</div>
          <p style={{ color: "var(--text-secondary)", marginBottom: 4, fontWeight: 600, fontSize: 16 }}>
            Profile not found
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 24 }}>
            Could not load details for @{username}
          </p>
          <Link
            to="/"
            style={{
              color: "var(--accent-light)",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            ← Back to search
          </Link>
        </div>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;
  const inList = isInList(user.user_id);

  const handleAddToggle = useCallback(() => {
    if (inList) {
      removeFromList(user.user_id);
    } else {
      // Build a UserProfileSummary-compatible object from the full profile
      addToList(
        {
          user_id: user.user_id,
          username: user.username,
          url: user.url,
          picture: user.picture,
          fullname: user.fullname,
          is_verified: user.is_verified,
          followers: user.followers,
          engagements: user.engagements,
          engagement_rate: user.engagement_rate,
          avg_views: user.avg_views,
        },
        platform
      );
    }
  }, [inList, user, platform, addToList, removeFromList]);

  const erHighlight =
    user.engagement_rate !== undefined && user.engagement_rate * 100 > 3;

  return (
    <Layout>
      {/* Breadcrumb */}
      <Link
        to="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          color: "var(--text-muted)",
          textDecoration: "none",
          marginBottom: 28,
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "var(--text-secondary)"; }}
        onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "var(--text-muted)"; }}
      >
        ← Back to search
      </Link>

      <div className="animate-fade-in">
        {/* Profile header */}
        <div
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 18,
            padding: "28px 32px",
            marginBottom: 20,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background gradient accent */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: -60,
              right: -60,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${platformColor}22, transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* Avatar */}
            <img
              src={user.picture}
              alt={user.fullname}
              style={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                objectFit: "cover",
                border: `3px solid ${platformColor}66`,
                flexShrink: 0,
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname)}&background=7c3aed&color=fff&size=88`;
              }}
            />

            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                <h1
                  style={{
                    fontSize: "clamp(20px, 3vw, 26px)",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  @{user.username}
                </h1>
                <VerifiedBadge verified={user.is_verified} />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 20,
                    color: platformColor,
                    background: `${platformColor}22`,
                    border: `1px solid ${platformColor}44`,
                  }}
                >
                  {getPlatformLabel(platform)}
                </span>
              </div>

              <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 8 }}>
                {user.fullname}
              </p>

              {user.description && (
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text-muted)",
                    lineHeight: 1.5,
                    maxWidth: 480,
                  }}
                >
                  {user.description}
                </p>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                <button
                  onClick={handleAddToggle}
                  aria-pressed={inList}
                  style={{
                    padding: "9px 20px",
                    borderRadius: 10,
                    border: inList ? "1px solid var(--accent)" : "1px solid var(--border-subtle)",
                    background: inList
                      ? "linear-gradient(135deg, var(--accent), var(--accent-light))"
                      : "var(--bg-card)",
                    color: inList ? "white" : "var(--text-secondary)",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    transition: "all 0.18s ease",
                  }}
                >
                  {inList ? (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Saved to List
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      Add to List
                    </>
                  )}
                </button>

                {user.url && (
                  <a
                    href={user.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "9px 20px",
                      borderRadius: 10,
                      border: "1px solid var(--border-subtle)",
                      background: "var(--bg-card)",
                      color: "var(--text-secondary)",
                      fontSize: 13,
                      fontWeight: 600,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      transition: "border-color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = platformColor;
                      (e.currentTarget as HTMLElement).style.color = platformColor;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--border-subtle)";
                      (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                    }}
                  >
                    View on {getPlatformLabel(platform)}
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 12,
          }}
        >
          <StatCard label="Followers" value={formatFollowers(user.followers)} />
          {user.engagement_rate !== undefined && (
            <StatCard
              label="Engagement Rate"
              value={formatEngagementRate(user.engagement_rate)}
              highlight={erHighlight}
            />
          )}
          {user.engagements !== undefined && (
            <StatCard label="Engagements" value={formatNumber(user.engagements)} />
          )}
          {user.posts_count !== undefined && (
            <StatCard label="Posts" value={user.posts_count.toLocaleString()} />
          )}
          {user.avg_likes !== undefined && (
            <StatCard label="Avg Likes" value={formatNumber(user.avg_likes)} />
          )}
          {user.avg_comments !== undefined && (
            <StatCard label="Avg Comments" value={formatNumber(user.avg_comments)} />
          )}
          {user.avg_reels_plays !== undefined && (
            <StatCard label="Avg Reel Plays" value={formatNumber(user.avg_reels_plays)} />
          )}
          {user.avg_views !== undefined && user.avg_views > 0 && (
            <StatCard label="Avg Views" value={formatNumber(user.avg_views)} />
          )}
          {user.gender && (
            <StatCard label="Gender" value={user.gender.charAt(0) + user.gender.slice(1).toLowerCase()} />
          )}
          {user.age_group && (
            <StatCard label="Age Group" value={user.age_group} />
          )}
        </div>
      </div>
    </Layout>
  );
}
