import { useEffect, useState } from "react";
import { Download, FileImage, Info, RefreshCw, Sparkles } from "lucide-react";
import ImageUploader from "../components/ImageUploader.jsx";
import ImagePreview from "../components/ImagePreview.jsx";
import { compressImage } from "../utils/compressImage.js";
import { downloadBlob } from "../utils/imageHelpers.js";
import { formatBytes } from "../utils/formatBytes.js";

const presets = [20, 50, 100, 200, 500];

export default function Compressor() {
  const [file, setFile] = useState(null);
  const [target, setTarget] = useState("50");
  const [customTarget, setCustomTarget] = useState("50");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    setResult(null);
    setError("");
  }, [file, target, customTarget]);

  const targetKB = target === "custom" ? Number(customTarget) : Number(target);

  async function handleCompress() {
    if (!file) return setError("Choose an image first.");
    if (!Number.isFinite(targetKB) || targetKB <= 0 || targetKB > 10240) {
      return setError("Enter a target between 1 KB and 10,240 KB.");
    }
    setBusy(true);
    setProgress(5);
    setError("");
    setResult(null);
    try {
      const compressed = await compressImage(file, targetKB, ({ percent }) => setProgress(Math.round(percent)));
      setResult(compressed);
    } catch (err) {
      setError(err.message || "Something went wrong while compressing.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setFile(null);
    setResult(null);
    setError("");
    setProgress(0);
  }

  return (
    <section className="tool-panel">
      <div className="panel-heading">
        <div>
          <div className="panel-kicker"><FileImage size={15} /> IMAGE COMPRESSOR</div>
          <h2>Compress to a target size</h2>
          <p>Reduce image file size for forms, websites, email and more.</p>
        </div>
        <span className="privacy-chip"><Sparkles size={13} /> Runs locally</span>
      </div>

      <div className="panel-grid">
        <div className="controls-column">
          <label className="field-label">1. Choose your image</label>
          <ImageUploader file={file} onChange={setFile} label="Click to upload an image" hint="JPG, PNG, WebP · up to browser limits" />

          <div className="field-block">
            <label className="field-label" htmlFor="target-size">2. Target file size</label>
            <div className="preset-row">
              {presets.map((size) => (
                <button key={size} type="button" className={`preset ${target === String(size) ? "selected" : ""}`} onClick={() => setTarget(String(size))}>{size} KB</button>
              ))}
              <button type="button" className={`preset ${target === "custom" ? "selected" : ""}`} onClick={() => setTarget("custom")}>Custom</button>
            </div>
            {target === "custom" && (
              <div className="custom-size">
                <input id="target-size" type="number" min="1" max="10240" value={customTarget} onChange={(e) => setCustomTarget(e.target.value)} />
                <span>KB</span>
              </div>
            )}
            <p className="field-help">We'll try to get as close as possible without exceeding your target.</p>
          </div>

          {error && <div className="alert error">{error}</div>}
          <button type="button" className="primary-button" onClick={handleCompress} disabled={!file || busy}>
            {busy ? <><RefreshCw size={17} className="spin" /> Compressing… {progress}%</> : <><Sparkles size={17} /> Compress image</>}
          </button>
          {busy && <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>}
          <div className="privacy-note"><Info size={15} /> Images are processed in this browser and aren't uploaded to a server.</div>
        </div>

        <div className="result-column">
          <div className="result-heading"><span>Preview</span>{result && <span className="status-pill">{result.reachedTarget ? "Target reached" : "Best effort"}</span>}</div>
          <div className="preview-frame"><ImagePreview file={file} blob={result?.blob} alt="Compressed image preview" /></div>
          {result ? (
            <>
              <div className="stats-row">
                <div className="stat"><span>Original</span><strong>{formatBytes(file.size)}</strong></div>
                <div className="stat"><span>Compressed</span><strong>{formatBytes(result.blob.size)}</strong></div>
                <div className="stat"><span>Dimensions</span><strong>{result.width} × {result.height}</strong></div>
              </div>
              {!result.reachedTarget && <div className="alert warning">The target couldn't be reached with the current minimum dimensions. This is the smallest result found by this tool.</div>}
              <button className="download-button" type="button" onClick={() => downloadBlob(result.blob, `${file.name.replace(/\.[^.]+$/, "")}-compressed.jpg`)}><Download size={17} /> Download compressed image</button>
              <button className="text-button" type="button" onClick={reset}>Start over</button>
            </>
          ) : (
            <div className="preview-hint">Your compressed image and file details will appear here.</div>
          )}
        </div>
      </div>
    </section>
  );
}
