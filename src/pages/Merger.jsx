import { useEffect, useState } from "react";
import { ArrowDownUp, Download, Combine, Info, RefreshCw } from "lucide-react";
import ImageUploader from "../components/ImageUploader.jsx";
import ImagePreview from "../components/ImagePreview.jsx";
import { mergeImages } from "../utils/mergeImages.js";
import { downloadBlob } from "../utils/imageHelpers.js";
import { formatBytes } from "../utils/formatBytes.js";

export default function Merger() {
  const [front, setFront] = useState(null);
  const [back, setBack] = useState(null);
  const [layout, setLayout] = useState("horizontal");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setResult(null);
    setError("");
  }, [front, back, layout]);

  async function handleMerge() {
    if (!front || !back) return setError("Upload both images before merging.");
    setBusy(true);
    setError("");
    try {
      setResult(await mergeImages(front, back, layout));
    } catch (err) {
      setError(err.message || "Could not merge these images.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setFront(null);
    setBack(null);
    setResult(null);
    setError("");
  }

  return (
    <section className="tool-panel">
      <div className="panel-heading">
        <div>
          <div className="panel-kicker"><Combine size={15} /> IMAGE MERGER</div>
          <h2>Combine two images into one</h2>
          <p>Place two images side by side or stack them vertically.</p>
        </div>
        <span className="privacy-chip">No upload required</span>
      </div>

      <div className="merge-layout">
        <div className="controls-column">
          <label className="field-label">1. Upload your images</label>
          <div className="upload-pair">
            <div><span className="mini-label">IMAGE 1 / FRONT</span><ImageUploader compact file={front} onChange={setFront} label="Choose first image" /></div>
            <div><span className="mini-label">IMAGE 2 / BACK</span><ImageUploader compact file={back} onChange={setBack} label="Choose second image" /></div>
          </div>

          <div className="field-block">
            <label className="field-label">2. Image arrangement</label>
            <div className="layout-options">
              <button type="button" className={`layout-option ${layout === "horizontal" ? "selected" : ""}`} onClick={() => setLayout("horizontal")}>
                <span className="layout-icon horizontal"><i /><i /></span>
                <span><strong>Side by side</strong><small>Horizontal</small></span>
              </button>
              <button type="button" className={`layout-option ${layout === "vertical" ? "selected" : ""}`} onClick={() => setLayout("vertical")}>
                <span className="layout-icon vertical"><i /><i /></span>
                <span><strong>One above another</strong><small>Vertical</small></span>
              </button>
            </div>
          </div>

          {error && <div className="alert error">{error}</div>}
          <button type="button" className="primary-button" onClick={handleMerge} disabled={!front || !back || busy}>
            {busy ? <><RefreshCw size={17} className="spin" /> Merging…</> : <><Combine size={17} /> Merge images</>}
          </button>
          <div className="privacy-note"><Info size={15} /> No extra gap is added. Each image keeps its proportions.</div>
        </div>

        <div className="result-column">
          <div className="result-heading"><span>Merged preview</span>{result && <span className="status-pill">Ready</span>}</div>
          <div className={`preview-frame merged-frame ${result ? "has-result" : ""}`}><ImagePreview blob={result?.blob} alt="Merged image preview" /></div>
          {result ? (
            <>
              <div className="stats-row">
                <div className="stat"><span>File size</span><strong>{formatBytes(result.blob.size)}</strong></div>
                <div className="stat"><span>Dimensions</span><strong>{result.width} × {result.height}</strong></div>
              </div>
              <button className="download-button" type="button" onClick={() => downloadBlob(result.blob, "merged-image.jpg")}><Download size={17} /> Download merged image</button>
              <button className="text-button" type="button" onClick={reset}>Start over</button>
            </>
          ) : (
            <div className="preview-hint">Your combined image will appear here after merging.</div>
          )}
        </div>
      </div>
    </section>
  );
}
