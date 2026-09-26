export function SiteFooter() {
  return (
    <footer className="relative">
      {/* Ours on the left, theirs on the right — but only once there is a
          row to have ends. Under sm the two wrap onto their own lines, and a
          stack of two left-aligned lines reads as an orphaned list rather than
          a footer, so they centre instead. */}
      <div className="container flex flex-wrap items-center justify-center gap-x-6 gap-y-1 py-6 text-center text-xs text-muted-foreground sm:justify-between sm:text-start">
        <p>© Poysian - built with &lt;3</p>
        {/* Hero art and names belong to Netmarble; a fan reference that
            reproduces them says so, unprompted and on every page. In English
            because it is the wording Netmarble is addressed by. */}
        <p>Not affiliated with or endorsed by Netmarble Corp.</p>
      </div>
    </footer>
  );
}
