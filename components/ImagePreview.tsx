"use client";

import { useEffect, useRef, useState } from "react";

import { icons } from "@/utils/icons";

export function ImagePreview({ src, alt }: ImagePreviewProps) {
  const [imgView, setImgView] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const handlePreviewPointerDown = (e: PointerEvent) => {
      const target = e.target;
      if (!(target instanceof Node)) return;

      const clickedImgPopup = imgRef.current?.contains(target) ?? false;
      if (clickedImgPopup) return;

      setImgView(false);
    };

    document.addEventListener("pointerdown", handlePreviewPointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePreviewPointerDown);
    };
  }, [imgView]);

  return (
    <div className="relative shrink-0 h-64 w-64 border border-gray-200 rounded-sm group">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-full w-full overflow-hidden rounded-sm"
      />
      <button
        type="button"
        className="absolute right-1 top-1 clickable z-10 text-center text-neutral-400 hidden group-hover:block"
        onClick={() => setImgView(!imgView)}
      >
        {icons.expand}
      </button>
      {imgView && (
        <div className="fixed top-0 left-0 flex flex-col justify-center items-center h-screen w-screen p-32 z-40 backdrop-blur-sm">
          <button
            type="button"
            className="text-xl mb-4 clickable text-red-400"
            onClick={() => setImgView(false)}
          >
            {icons.cancel}
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            ref={imgRef}
            className="max-w-full max-h-full"
          />
        </div>
      )}
    </div>
  );
}

type ImagePreviewProps = React.HTMLProps<HTMLImageElement>;
