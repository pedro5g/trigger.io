export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-gradient-to-br from-gray-950/90 via-gray-900 to-blue-950/50">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-gradient-to-br bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] from-gray-900 via-gray-800 to-blue-900 bg-[size:52px_52px]"
      />
      <div className="z-10">{children}</div>
    </div>
  );
}
