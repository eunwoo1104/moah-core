"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useWatch } from "react-hook-form";

import { ImagePreview } from "@/components/ImagePreview";
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
      const convertedFiles = Array.from(files as FileList);
      return convertedFiles.map((item) => {
        return {
          src: URL.createObjectURL(item),
          alt: item.name,
          // TODO: read EXIF metadata if able
        };
      });
    },
  });

  return (
    <div>
      <h1 className="font-bold text-2xl mb-2">Upload New Media</h1>
      <form noValidate={true}>
        <label className="bg-neutral-100 dark:bg-neutral-800 text-lg font-semibold p-3 inline-block rounded-md clickable">
          <p className="text-center">
            {media ? "Replace" : "Choose"} medias to upload...
          </p>
          <input
            className="hidden"
            type="file"
            multiple={true}
            {...register("media", { required: true })}
          />
        </label>
        <div className="flex flex-row overflow-x-auto mt-5 space-x-3">
          {media &&
            media.map((item, idx) => (
              <ImagePreview src={item.src} alt={item.alt} key={idx} />
            ))}
        </div>
        {/* Below should display after media is attached */}
      </form>
    </div>
  );
}
