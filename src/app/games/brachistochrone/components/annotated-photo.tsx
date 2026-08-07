import Image from "next/image";

interface PhotoMarker {
  x: number; // percent, 0-100
  y: number; // percent, 0-100
  label: string;
  side?: "left" | "right"; // which way the label pill sits relative to its dot; defaults to right
}

interface AnnotatedPhotoProps {
  src: string;
  alt: string;
  credit: string;
  markers: PhotoMarker[];
  rotation?: string;
}

/**
 * A real photo framed like the video embeds (white mat, slight rotation),
 * with a few point markers hand-labeling the part of the frame that
 * actually demonstrates the idea — so the photo is doing argumentative work,
 * not just sitting there as decoration.
 */
export function AnnotatedPhoto({
  src,
  alt,
  credit,
  markers,
  rotation = "rotate-0",
}: AnnotatedPhotoProps) {
  return (
    <div
      className={`bg-background border-foreground/80 ${rotation} rounded-2xl border-2 p-2.5 shadow-sm sm:p-3`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover"
        />
        {markers.map((marker) => (
          <div
            key={marker.label}
            className="absolute flex items-center gap-1.5"
            style={{
              left: `${marker.x}%`,
              top: `${marker.y}%`,
              flexDirection: marker.side === "left" ? "row-reverse" : "row",
              transform: marker.side === "left" ? "translate(-100%, -50%)" : "translate(0, -50%)",
            }}
          >
            <span
              className="border-foreground bg-brand size-3 shrink-0 rounded-full border-2 shadow-sm"
              aria-hidden
            />
            <span className="border-foreground/80 bg-background rounded-full border-2 px-2 py-0.5 text-[0.7rem] leading-tight font-medium whitespace-nowrap shadow-sm">
              {marker.label}
            </span>
          </div>
        ))}
      </div>
      <p className="text-foreground/60 mt-2 px-1 text-[0.7rem]">{credit}</p>
    </div>
  );
}
