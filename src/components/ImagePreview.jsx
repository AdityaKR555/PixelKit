import { useEffect, useState } from "react";

export default function ImagePreview({ file, blob, alt = "Image preview" }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const source = blob || file;
    if (!source) {
      setUrl("");
      return;
    }
    const nextUrl = URL.createObjectURL(source);
    setUrl(nextUrl);
    return () => URL.revokeObjectURL(nextUrl);
  }, [file, blob]);

  if (!url) return <div className="preview-empty">Your preview will appear here</div>;
  return <img className="image-preview" src={url} alt={alt} />;
}
