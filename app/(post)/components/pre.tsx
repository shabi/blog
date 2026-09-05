export function Pre({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <pre
      className="
        my-6
        overflow-x-auto
        rounded-lg
        bg-neutral-100
        p-4
        text-sm
        dark:bg-neutral-900
      "
    >
      {children}
    </pre>
  );
}
