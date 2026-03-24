"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

interface BannerUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
}

export function BannerUpload({ value, onChange }: BannerUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error("Invalid file type. Please upload a JPEG, PNG, or WebP image.");
        return;
      }
      if (file.size > MAX_SIZE) {
        toast.error("File too large. Maximum size is 5MB.");
        return;
      }

      setUploading(true);

      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data: profile } = await supabase
          .from("profiles")
          .select("organization_id")
          .eq("id", user.id)
          .single();

        if (!profile?.organization_id) throw new Error("No organization found");

        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${profile.organization_id}/${timestamp}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("event-banners")
          .upload(path, file, { cacheControl: "3600", upsert: false });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("event-banners")
          .getPublicUrl(path);

        onChange(publicUrlData.publicUrl);
      } catch (err: any) {
        toast.error(err.message || "Failed to upload image");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) uploadFile(file);
      // Reset so the same file can be re-selected
      e.target.value = "";
    },
    [uploadFile]
  );

  const handleRemove = useCallback(() => {
    onChange(null);
  }, [onChange]);

  if (value) {
    return (
      <div className="space-y-1.5">
        <div className="relative rounded-2xl overflow-hidden border border-neutral-200">
          <img
            src={value}
            alt="Event banner"
            className="w-full h-48 object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "border-2 border-dashed rounded-2xl p-10 text-center transition-colors group",
          uploading
            ? "border-primary-300 bg-primary-50/30 cursor-wait"
            : dragOver
              ? "border-primary-400 bg-primary-50/40"
              : "border-neutral-200 hover:border-primary-300 hover:bg-primary-50/20 cursor-pointer"
        )}
      >
        {uploading ? (
          <>
            <Loader2 className="w-8 h-8 text-primary-400 mx-auto mb-3 animate-spin" />
            <p className="text-sm font-medium text-primary-600">Uploading...</p>
          </>
        ) : (
          <>
            <Upload className="w-8 h-8 text-neutral-300 mx-auto mb-3 group-hover:text-primary-400 transition-colors" />
            <p className="text-sm font-medium text-neutral-500">
              Drag & drop your banner here
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              or{" "}
              <span className="text-primary-600 font-medium">
                click to browse
              </span>
            </p>
            <p className="text-xs text-neutral-300 mt-2">
              Recommended: 1920x1080px -- Max 5MB
            </p>
          </>
        )}
      </div>
    </div>
  );
}
