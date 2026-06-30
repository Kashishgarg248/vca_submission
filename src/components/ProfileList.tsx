import { memo } from "react";
import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
}

export const ProfileList = memo(function ProfileList({ profiles, platform }: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "80px 24px",
          color: "var(--text-muted)",
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
        <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
          No results found
        </p>
        <p style={{ fontSize: 13 }}>Try a different search term or platform</p>
      </div>
    );
  }

  return (
    <ul
      className="card-stagger"
      style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}
      aria-label={`${profiles.length} influencer profiles`}
    >
      {profiles.map((profile) => (
        <li key={profile.user_id}>
          <ProfileCard profile={profile} platform={platform} />
        </li>
      ))}
    </ul>
  );
});
