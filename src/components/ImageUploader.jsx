import { useRef } from "react";
import { Upload, ImagePlus } from "lucide-react";

export default function ImageUploader({ label = "Upload an image", hint = "JPG, PNG or WebP", file, onChange, compact = false }) {
  const inputRef = useRef(null);

  function handleFiles(files) {
    const selected = files?.[0];
    if (selected) onChange(selected);
  }

  return (
    <div className={`upload-wrap ${compact ? "compact" : ""}`}>
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/bmp"
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />
      <button type="button" className={`upload-box ${file ? "has-file" : ""}`} onClick={() => inputRef.current?.click()}>
        {file ? (
          <>
            <span className="upload-icon success"><ImagePlus size={21} /></span>
            <span className="upload-copy">
              <strong>{file.name}</strong>
              <small>{(file.size / 1024).toFixed(1)} KB · Click to change</small>
            </span>
          </>
        ) : (
          <>
            <span className="upload-icon"><Upload size={21} /></span>
            <span className="upload-copy">
              <strong>{label}</strong>
              <small>{hint}</small>
            </span>
          </>
        )}
      </button>
    </div>
  );
}
