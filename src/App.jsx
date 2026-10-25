import { useState } from "react";
import { Image, Combine, ShieldCheck, Zap } from "lucide-react";
import Compressor from "./pages/Compressor.jsx";
import Merger from "./pages/Merger.jsx";

export default function App() {
  const [activeTool, setActiveTool] = useState("compress");

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="PixelKit home">
          <span className="brand-mark"><Image size={19} strokeWidth={2.5} /></span>
          <span>pixelkit</span>
        </a>
        <div className="topbar-note"><ShieldCheck size={15} /> Files stay on your device</div>
      </header>

      <main className="main-content">
        <section className="intro">
          <div className="eyebrow"><Zap size={14} fill="currentColor" /> FREE ONLINE IMAGE TOOLS</div>
          <h1>Get your images<br className="mobile-break" /> <span>ready in seconds.</span></h1>
          <p>Compress images to a target size or combine two images into one. Simple, quick, and private.</p>
        </section>

        <div className="tool-switcher" role="tablist" aria-label="Image tools">
          <button role="tab" aria-selected={activeTool === "compress"} className={activeTool === "compress" ? "tool-tab active" : "tool-tab"} onClick={() => setActiveTool("compress")}>
            <Image size={17} /> Compress image
          </button>
          <button role="tab" aria-selected={activeTool === "merge"} className={activeTool === "merge" ? "tool-tab active" : "tool-tab"} onClick={() => setActiveTool("merge")}>
            <Combine size={17} /> Merge images
          </button>
        </div>

        {activeTool === "compress" ? <Compressor /> : <Merger />}

        <footer className="footer">
          <span><ShieldCheck size={14} /> Your images are processed locally in your browser.</span>
          <span>Made for quick, everyday image tasks.</span>
        </footer>
      </main>
    </div>
  );
}
