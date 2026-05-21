"use client";

import { useState } from "react";
import { ImagePlus, Film, X, Loader2, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  addDishImage,
  removeDishImage,
  setDishVideo,
} from "@/app/admin/menu/actions";
import type { AdminImage } from "@/lib/menu/get-menu";

const BUCKET = "menu-images";
const MAX_IMAGE_MB = 8;
const MAX_VIDEO_MB = 50;

function fileExt(name: string): string {
  const m = name.match(/\.([a-z0-9]+)$/i);
  return m ? m[1].toLowerCase() : "bin";
}
function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * Photos + video manager for a dish. Uploads files straight to Supabase
 * Storage from the browser (so big phone photos/videos aren't capped by the
 * server), then records the public URL via server actions. Changes are saved
 * immediately; calls onChange so the parent can refresh its list on close.
 */
export default function DishMediaManager({
  dishId,
  initialImages,
  initialVideoUrl,
  onChange,
}: {
  dishId: string;
  initialImages: AdminImage[];
  initialVideoUrl?: string;
  onChange?: () => void;
}) {
  const [images, setImages] = useState<AdminImage[]>(initialImages);
  const [videoUrl, setVideoUrl] = useState<string | null>(initialVideoUrl ?? null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const uploadImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErr(null);
    setBusy(true);
    const supabase = createClient();
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
          setErr(`Each photo must be under ${MAX_IMAGE_MB}MB.`);
          continue;
        }
        const path = `${dishId}/img-${uid()}.${fileExt(file.name)}`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, { contentType: file.type });
        if (upErr) {
          setErr(upErr.message);
          continue;
        }
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
        const res = await addDishImage(dishId, pub.publicUrl);
        if (res.ok && res.id) {
          setImages((cur) => [...cur, { id: res.id as string, url: pub.publicUrl }]);
          onChange?.();
        } else {
          setErr(res.error ?? "Couldn't save the photo.");
        }
      }
    } finally {
      setBusy(false);
    }
  };

  const removeImage = async (id: string) => {
    setImages((cur) => cur.filter((i) => i.id !== id));
    const res = await removeDishImage(id);
    if (!res.ok) setErr(res.error ?? "Couldn't remove the photo.");
    else onChange?.();
  };

  const uploadVideo = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setErr("Please choose a video file.");
      return;
    }
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      setErr(`Video must be under ${MAX_VIDEO_MB}MB.`);
      return;
    }
    setErr(null);
    setBusy(true);
    const supabase = createClient();
    try {
      const path = `${dishId}/video-${uid()}.${fileExt(file.name)}`;
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { contentType: file.type });
      if (upErr) {
        setErr(upErr.message);
        return;
      }
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      const res = await setDishVideo(dishId, pub.publicUrl);
      if (res.ok) {
        setVideoUrl(pub.publicUrl);
        onChange?.();
      } else {
        setErr(res.error ?? "Couldn't save the video.");
      }
    } finally {
      setBusy(false);
    }
  };

  const removeVideo = async () => {
    setVideoUrl(null);
    const res = await setDishVideo(dishId, null);
    if (!res.ok) setErr(res.error ?? "Couldn't remove the video.");
    else onChange?.();
  };

  return (
    <div className="space-y-3">
      {/* Photos */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider text-foreground-subtle">
            Photos
          </span>
          {busy && <Loader2 size={13} className="animate-spin text-foreground-subtle" />}
        </div>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {images.map((im) => (
            <div
              key={im.id}
              className="relative h-16 w-16 overflow-hidden rounded-lg border border-border"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                aria-label="Remove photo"
                onClick={() => removeImage(im.id)}
                className="absolute right-0.5 top-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-espresso/80 text-ivory hover:bg-red"
              >
                <X size={11} />
              </button>
            </div>
          ))}

          <label className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-cream text-foreground-muted hover:border-espresso hover:text-espresso">
            <ImagePlus size={16} />
            <span className="text-[9px] font-semibold uppercase tracking-wider">Add</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                uploadImages(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        </div>
        <p className="mt-1 text-[11px] text-foreground-subtle">
          The first photo shows on the menu tile; all photos appear in the detail
          popup. Up to {MAX_IMAGE_MB}MB each.
        </p>
      </div>

      {/* Video */}
      <div>
        <span className="text-[10px] uppercase tracking-wider text-foreground-subtle">
          Video (plays on the menu tile)
        </span>
        {videoUrl ? (
          <div className="mt-1.5 flex items-center gap-3">
            <video
              src={videoUrl}
              muted
              playsInline
              className="h-16 w-24 rounded-lg border border-border object-cover"
            />
            <button
              type="button"
              onClick={removeVideo}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-espresso hover:border-red hover:text-red"
            >
              <Trash2 size={13} /> Remove video
            </button>
          </div>
        ) : (
          <label className="mt-1.5 inline-flex cursor-pointer items-center gap-2 rounded-full border border-dashed border-border bg-cream px-4 py-2 text-sm font-semibold text-espresso hover:border-espresso">
            <Film size={15} />
            Upload a video
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                uploadVideo(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        )}
        <p className="mt-1 text-[11px] text-foreground-subtle">
          A short clip (under {MAX_VIDEO_MB}MB) loops silently on the tile.
        </p>
      </div>

      {err && <p className="text-xs text-red">{err}</p>}
    </div>
  );
}
