"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LinkedInUpload() {
  const [status, setStatus] = useState<"idle"|"loading"|"done"|"error">("idle");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("loading");
    setMessage("Parsing your LinkedIn data...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/linkedin/parse", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setStatus("done");
        setMessage(`Found ${data.experience} jobs, ${data.education} education entries, ${data.skills} skills, ${data.certifications} certifications!`);
        setTimeout(() => router.push("/"), 2000);
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Upload failed. Please try again.");
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        body{background:#02020a;color:#e2e8f0;font-family:'Inter',sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center}
        .card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:48px;max-width:560px;width:90%;backdrop-filter:blur(12px)}
        .eyebrow{font-family:'JetBrains Mono',monospace;font-size:11px;color:#00ffc8;letter-spacing:0.2em;margin-bottom:12px}
        h1{font-size:28px;font-weight:700;color:#fff;letter-spacing:-0.03em;margin-bottom:8px}
        .sub{font-size:14px;color:#475569;line-height:1.7;margin-bottom:32px}
        .steps{background:rgba(0,0,0,0.3);border-radius:12px;padding:20px 24px;margin-bottom:28px;display:flex;flex-direction:column;gap:12px}
        .step{display:flex;align-items:flex-start;gap:12px;font-size:13px;color:#64748b}
        .step-num{font-family:'JetBrains Mono',monospace;font-size:11px;color:#a855f7;background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.2);border-radius:100px;width:22px;height:22px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
        .step a{color:#00ffc8;text-decoration:none}
        .upload-zone{border:2px dashed rgba(255,255,255,0.1);border-radius:12px;padding:36px;text-align:center;cursor:pointer;transition:all 0.2s;position:relative}
        .upload-zone:hover{border-color:rgba(0,255,200,0.3);background:rgba(0,255,200,0.02)}
        .upload-zone input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
        .upload-icon{font-size:32px;margin-bottom:12px}
        .upload-text{font-size:14px;color:#475569}
        .upload-hint{font-family:'JetBrains Mono',monospace;font-size:11px;color:#1e3a5f;margin-top:6px}
        .status-box{margin-top:20px;padding:16px 20px;border-radius:10px;font-size:13px;font-family:'JetBrains Mono',monospace}
        .status-loading{background:rgba(168,85,247,0.08);border:1px solid rgba(168,85,247,0.2);color:#a855f7}
        .status-done{background:rgba(0,255,136,0.06);border:1px solid rgba(0,255,136,0.2);color:#00ff88}
        .status-error{background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.2);color:#f87171}
        .spinner{display:inline-block;width:10px;height:10px;border:1px solid currentColor;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;margin-right:8px}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      <div className="card">
        <div className="eyebrow">// LINKEDIN SYNC</div>
        <h1>Connect LinkedIn</h1>
        <p className="sub">Export your LinkedIn data and upload it here. Your experience, education, skills, and certifications will appear on your portfolio automatically.</p>

        <div className="steps">
          <div className="step">
            <div className="step-num">1</div>
            <div>Go to <a href="https://www.linkedin.com/mypreferences/d/download-my-data" target="_blank">LinkedIn Settings → Data Privacy → Get a copy of your data</a></div>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <div>Select <strong style={{color:"#e2e8f0"}}>Download larger data archive</strong> and request it. LinkedIn emails you a ZIP file within 10 minutes.</div>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <div>Download the ZIP file from your email and upload it below — don't unzip it.</div>
          </div>
        </div>

        <div className="upload-zone">
          <input type="file" accept=".zip" onChange={handleUpload} />
          <div className="upload-icon">📦</div>
          <div className="upload-text">Drop your LinkedIn ZIP here or click to browse</div>
          <div className="upload-hint">LinkedIn_[yourname].zip · Max 50MB</div>
        </div>

        {status !== "idle" && (
          <div className={`status-box status-${status}`}>
            {status === "loading" && <span className="spinner"></span>}
            {status === "done" && "✓ "}
            {status === "error" && "✗ "}
            {message}
          </div>
        )}
      </div>
    </>
  );
}