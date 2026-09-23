type PageLoadingProps = {
  label?: string;
};

export default function PageLoading({
  label = "Loading…",
}: PageLoadingProps) {
  return (
    <div
      className="flex min-h-[40vh] flex-col items-center justify-center gap-3"
      role="status"
      aria-live="polite"
    >
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent"
        aria-hidden
      />
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}
