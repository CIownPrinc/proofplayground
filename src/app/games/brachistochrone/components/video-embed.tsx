interface VideoEmbedProps {
  videoId: string;
  title: string;
  eyebrow?: string;
}

// Framed like a little TV set on the page rather than a bare dropped-in
// iframe: a white mat, a slight rotation for personality, and a caption row
// so it reads as an intentional page element, not an embed widget.
export function VideoEmbed({ videoId, title, eyebrow = "Worth watching" }: VideoEmbedProps) {
  return (
    <div className="bg-background border-foreground/80 -rotate-1 rounded-2xl border-2 p-2.5 shadow-sm sm:p-3">
      <div className="aspect-video w-full overflow-hidden rounded-lg">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title}
          className="size-full"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
      <p className="text-foreground/70 mt-2 flex items-baseline gap-1.5 px-1 text-xs">
        <span className="font-heading text-foreground font-medium">📺 {eyebrow}:</span>
        {title}
      </p>
    </div>
  );
}
