import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { useStore } from "@/store/useStore";
import { formatFollowers } from "@/utils/formatters";
import { getPlatformColor } from "@/utils/dataHelpers";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
}

export function ProfileCard({ profile, platform }: ProfileCardProps) {
  const navigate = useNavigate();
  const { addToList, removeFromList, isInList } = useStore();
  const inList = isInList(profile.user_id);
  const platformColor = getPlatformColor(platform);

  const handleCardClick = () => {
    navigate(`/profile/${profile.username}?platform=${platform}`);
  };

  const handleAddToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (inList) {
        removeFromList(profile.user_id);
      } else {
        addToList(profile, platform);
      }
    },
    [inList, profile, platform, addToList, removeFromList]
  );

  const engagementRate = profile.engagement_rate;
  const erDisplay =
    engagementRate !== undefined
      ? (engagementRate * 100).toFixed(1) + "%"
      : null;

  return (
    <article
      onClick={handleCardClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "16px 20px",
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: 14,
        cursor: "pointer",
        transition: "all 0.18s ease",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.background = "var(--bg-card-hover)";
        el.style.borderColor = "var(--border)";
        el.style.transform = "translateY(-1px)";
        el.style.boxShadow = `0 4px 20px ${platformColor}18`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.background = "var(--bg-card)";
        el.style.borderColor = "var(--border-subtle)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Left accent bar */}
      {inList && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            background: `linear-gradient(to bottom, var(--accent), var(--accent-light))`,
            borderRadius: "3px 0 0 3px",
          }}
          aria-hidden="true"
        />
      )}

      {/* Avatar */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <img
          src={profile.picture}
          alt={profile.fullname}
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            objectFit: "cover",
            border: `2px solid ${platformColor}44`,
          }}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullname)}&background=7c3aed&color=fff`;
          }}
        />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span
            style={{
              fontWeight: 700,
              fontSize: 14,
              color: "var(--text-primary)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            @{profile.username}
          </span>
          <VerifiedBadge verified={profile.is_verified} />
        </div>
        <div
          style={{
            fontSize: 12,
            color: "var(--text-secondary)",
            marginTop: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {profile.fullname}
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "flex",
          gap: 20,
          marginRight: 12,
          flexShrink: 0,
        }}
      >
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>
            {formatFollowers(profile.followers)}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>followers</div>
        </div>
        {erDisplay && (
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: parseFloat(erDisplay) > 3 ? "#10b981" : "var(--text-primary)",
              }}
            >
              {erDisplay}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>eng. rate</div>
          </div>
        )}
      </div>

      {/* Add to list button */}
      <button
        onClick={handleAddToggle}
        aria-label={inList ? `Remove ${profile.username} from list` : `Add ${profile.username} to list`}
        aria-pressed={inList}
        style={{
          padding: "7px 14px",
          borderRadius: 8,
          border: inList ? "1px solid var(--accent)" : "1px solid var(--border-subtle)",
          background: inList ? "var(--accent-glow)" : "transparent",
          color: inList ? "var(--accent-light)" : "var(--text-muted)",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          flexShrink: 0,
          transition: "all 0.15s ease",
          display: "flex",
          alignItems: "center",
          gap: 5,
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          if (!inList) {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.color = "var(--accent-light)";
          }
        }}
        onMouseLeave={(e) => {
          if (!inList) {
            e.currentTarget.style.borderColor = "var(--border-subtle)";
            e.currentTarget.style.color = "var(--text-muted)";
          }
        }}
      >
        {inList ? (
          <>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Saved
          </>
        ) : (
          <>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add to List
          </>
        )}
      </button>
    </article>
  );
}
