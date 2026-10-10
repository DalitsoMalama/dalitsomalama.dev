/**
 * An endless horizontal ticker. The list is rendered twice and slid by half
 * its width, so the loop has no seam. Pauses on hover; under reduced motion
 * the global rule in globals.css stops it.
 */
export function Marquee({ items, duration = 45 }: { items: string[]; duration?: number }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="flex items-center whitespace-nowrap">
          <span className="px-6 text-2xl font-medium tracking-tight text-foreground/80 sm:text-3xl">{item}</span>
          <span aria-hidden className="text-accent">✦</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="group relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused]"
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
