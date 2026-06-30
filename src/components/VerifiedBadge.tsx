interface VerifiedBadgeProps {
  verified: boolean;
}

export function VerifiedBadge({ verified }: VerifiedBadgeProps) {
  if (!verified) return null;
  return (
    <span
      title="Verified account"
      aria-label="Verified"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: "var(--accent)",
        marginLeft: 5,
        verticalAlign: "middle",
        flexShrink: 0,
      }}
    >
      <svg width="9" height="9" viewBox="0 0 10 8" fill="none" aria-hidden="true">
        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
