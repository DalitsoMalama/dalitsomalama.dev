export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-1 px-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Epy. Built with Next.js and Supabase.</p>
        <p>Got an idea worth building? Head to the Ideas portal.</p>
      </div>
    </footer>
  );
}
