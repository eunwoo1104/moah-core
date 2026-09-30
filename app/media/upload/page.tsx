"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useWatch } from "react-hook-form";

import { clientMediaUploadSchema } from "@/utils/validation";

export default function MediaUpload() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(clientMediaUploadSchema),
  });
  const media = useWatch({
    control,
    name: "media",
    compute: (files) => {
      if (!files || !(files as FileList)[0]) return null;
      const file = (files as FileList)[0];
      return {
        src: URL.createObjectURL(file),
        alt: file.name,
      };
    },
  });

  return (
    <div>
      <form noValidate={true}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {media && <img src={media.src} alt={media.alt} className="mb-3" />}
        <label className="border-dashed border-2 p-2">
          <p className="text-center">
            {media ? "Replace media" : "Start by choosing media to upload..."}
          </p>
          <input
            className="hidden"
            type="file"
            {...register("media", { required: true })}
          />
        </label>
        {/* Below should display after media is attached */}
      </form>
    </div>
  );
}
