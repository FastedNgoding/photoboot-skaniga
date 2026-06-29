import { useState, useRef, useEffect, useCallback } from "react";
import {
  Camera,
  ArrowBigLeft,
  Check,
  LoaderLinesAlt,
  ArrowRight,
} from "@boxicons/react";

const TOTAL_CAPTURE = 5;
const PICK_COUNT = 3;

export default function PhotoPage({ onComplete, onBack }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const mountedRef = useRef(false);
  const startCameraRef = useRef(null);
  const photosRef = useRef([]);

  const [photos, setPhotos] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [showFlash, setShowFlash] = useState(false);
  const [phase, setPhase] = useState("setup"); // setup | ready | capturing | selecting | done
  const [camError, setCamError] = useState(null);
  const [autoRunning, setAutoRunning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [selected, setSelected] = useState([]); // indices of 3 chosen photos

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(
    async (deviceId = null, retryCount = 0) => {
      if (streamRef.current) stopCamera();
      setCamError(null);
      try {
        const videoConstraints = { width: { ideal: 1280 }, height: { ideal: 720 } };
        if (deviceId) videoConstraints.deviceId = { exact: deviceId };
        else videoConstraints.facingMode = "user";

        const stream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current && mountedRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setPhase("ready");
        }
      } catch (e) {
        if (retryCount < 2) {
          setTimeout(() => startCameraRef.current?.(deviceId, retryCount + 1), 500);
          return;
        }
        setCamError("Kamera tidak bisa diakses. Pastikan izin kamera diberikan.");
        stopCamera();
      }
    },
    [stopCamera]
  );

  useEffect(() => { startCameraRef.current = startCamera; }, [startCamera]);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true });
        s.getTracks().forEach((t) => t.stop());
        const all = await navigator.mediaDevices.enumerateDevices();
        const vids = all.filter((d) => d.kind === "videoinput");
        setDevices(vids);
        if (vids.length > 0) setSelectedDeviceId((p) => p || vids[0].deviceId);
      } catch (e) { console.error(e); }
    };
    getDevices();
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    const t = setTimeout(() => startCamera(selectedDeviceId || undefined), selectedDeviceId ? 400 : 800);
    return () => { mountedRef.current = false; stopCamera(); clearTimeout(t); };
  }, [selectedDeviceId, startCamera, stopCamera]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.92);
  }, []);

  const doCountdownAndCapture = useCallback(async () => {
    for (let i = 3; i >= 1; i--) {
      setCountdown(i);
      await new Promise((r) => setTimeout(r, 1000));
    }
    setCountdown(0);
    await new Promise((r) => setTimeout(r, 200));
    const dataUrl = capturePhoto();
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 500);
    const newPhotos = [...photosRef.current, dataUrl];
    photosRef.current = newPhotos;
    setPhotos([...newPhotos]);
    setCountdown(null);
    await new Promise((r) => setTimeout(r, 1200));
    return dataUrl;
  }, [capturePhoto]);

  const runAutoCapture = useCallback(async () => {
    if (autoRunning) return;
    setAutoRunning(true);
    photosRef.current = [];
    setPhotos([]);
    setPhase("capturing");
    await new Promise((r) => setTimeout(r, 800));
    for (let i = 0; i < TOTAL_CAPTURE; i++) {
      await doCountdownAndCapture();
    }
    setAutoRunning(false);
    stopCamera();
    setPhase("selecting");
  }, [autoRunning, doCountdownAndCapture, stopCamera]);

  const toggleSelect = (idx) => {
    setSelected((prev) => {
      if (prev.includes(idx)) return prev.filter((i) => i !== idx);
      if (prev.length >= PICK_COUNT) return prev; // max 3
      return [...prev, idx];
    });
  };

  const handleConfirmSelection = () => {
    const chosen = selected.map((i) => photos[i]);
    onComplete(chosen);
  };

  const handleRetry = () => {
    stopCamera();
    setCamError(null);
    setPhase("setup");
    setPhotos([]);
    setSelected([]);
    photosRef.current = [];
    setTimeout(() => startCamera(selectedDeviceId), 500);
  };

  const handleRetakeAll = () => {
    setPhotos([]);
    setSelected([]);
    photosRef.current = [];
    setPhase("setup");
    setTimeout(() => startCamera(selectedDeviceId), 500);
  };

  // ─── SELECTING PHASE ────────────────────────────────────────────────────────
  if (phase === "selecting") {
    return (
      <div className="fixed inset-0 flex flex-col overflow-hidden" style={{ background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)" }}>
        <style>{`
          @keyframes sk-sel-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .sk-sel-in { animation: sk-sel-in 0.5s ease-out; }
          @keyframes sk-badge { from { transform: scale(0); } to { transform: scale(1); } }
          .sk-badge { animation: sk-badge 0.2s cubic-bezier(0.34,1.56,0.64,1); }
          @keyframes sk-glow { 0%,100% { box-shadow: 0 0 20px #a855f760; } 50% { box-shadow: 0 0 40px #a855f7aa; } }
          .sk-glow { animation: sk-glow 2s ease-in-out infinite; }
        `}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-6 md:px-12 pt-8 pb-4 shrink-0">
          <button
            onClick={handleRetakeAll}
            className="flex items-center gap-2 rounded-full px-4 py-2 font-bold text-sm backdrop-blur-md transition-all hover:scale-105 active:scale-95"
            style={{ background: "rgba(255,255,255,0.08)", color: "#e2e8f0", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <ArrowBigLeft size="18" />
            Ulangi Foto
          </button>
          <div className="text-center">
            <p className="text-xl md:text-2xl font-black tracking-[0.15em] text-white">PILIH 3 FOTO</p>
            <div className="h-0.5 w-12 mx-auto mt-1 rounded-full" style={{ background: "#a855f7" }} />
          </div>
          <div className="w-28 flex justify-end">
            <div className="rounded-full px-4 py-1.5 text-sm font-bold" style={{ background: selected.length === PICK_COUNT ? "#a855f7" : "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(168,85,247,0.4)", transition: "all 0.3s" }}>
              {selected.length}/{PICK_COUNT}
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-slate-400 font-medium pb-4 shrink-0 px-4">
          Tap foto yang paling bagus — pilih <strong className="text-white">3 foto</strong> untuk dilanjutkan ke pemilihan frame
        </p>

        {/* Photo grid */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-4 min-h-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 max-w-5xl mx-auto">
            {photos.map((photo, idx) => {
              const rank = selected.indexOf(idx);
              const isSelected = rank !== -1;
              const isMaxed = selected.length >= PICK_COUNT && !isSelected;
              return (
                <button
                  key={idx}
                  onClick={() => toggleSelect(idx)}
                  disabled={isMaxed}
                  className="relative rounded-2xl overflow-hidden sk-sel-in outline-none border-none cursor-pointer transition-all duration-300"
                  style={{
                    aspectRatio: "4/3",
                    opacity: isMaxed ? 0.35 : 1,
                    transform: isSelected ? "scale(1.03)" : "scale(1)",
                    boxShadow: isSelected
                      ? "0 0 0 3px #a855f7, 0 8px 30px rgba(168,85,247,0.5)"
                      : "0 4px 20px rgba(0,0,0,0.4)",
                    animationDelay: `${idx * 0.08}s`,
                  }}
                >
                  <img src={photo} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />

                  {/* Overlay when not selected */}
                  {!isSelected && (
                    <div className="absolute inset-0 flex items-end justify-end p-2"
                      style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }}>
                      <span className="text-white/60 text-xs font-bold">#{idx + 1}</span>
                    </div>
                  )}

                  {/* Selected badge */}
                  {isSelected && (
                    <>
                      <div className="absolute inset-0" style={{ background: "rgba(168,85,247,0.15)" }} />
                      <div
                        className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center sk-badge"
                        style={{ background: "#a855f7", boxShadow: "0 4px 12px rgba(168,85,247,0.6)" }}
                      >
                        <span className="text-white font-black text-sm">{rank + 1}</span>
                      </div>
                      <div className="absolute bottom-2 left-2 rounded-lg px-2 py-0.5 text-xs font-bold text-white"
                        style={{ background: "rgba(168,85,247,0.85)" }}>
                        Terpilih
                      </div>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="shrink-0 px-4 pb-8 pt-4 flex flex-col items-center gap-3">
          {selected.length < PICK_COUNT && (
            <p className="text-slate-400 text-sm">
              Pilih {PICK_COUNT - selected.length} foto lagi
            </p>
          )}
          <button
            onClick={handleConfirmSelection}
            disabled={selected.length !== PICK_COUNT}
            className="flex items-center gap-3 rounded-2xl px-10 py-4 font-extrabold text-base uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: selected.length === PICK_COUNT ? "linear-gradient(135deg, #a855f7, #7c3aed)" : "rgba(255,255,255,0.08)",
              color: "#fff",
              boxShadow: selected.length === PICK_COUNT ? "0 8px 30px rgba(168,85,247,0.5)" : "none",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <span>Pilih Frame</span>
            <ArrowRight size="20" />
          </button>
        </div>
      </div>
    );
  }

  // ─── CAMERA PHASE ──────────────────────────────────────────────────────────
  const neutralBg = "linear-gradient(135deg, #0f0c29, #302b63, #24243e)";
  const accentColor = "#a855f7";
  const textColor = "#e2e8f0";
  const borderColor = "#7c3aed";

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden" style={{ background: neutralBg }}>
      <canvas ref={canvasRef} className="hidden" />

      {showFlash && (
        <div className="fixed inset-0 z-40 animate-flash" style={{ background: "#ffffff" }} />
      )}

      {/* Particles bg */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {["📸","✨","🌟","💫","📷"].map((c, i) => (
          <div key={i} className="absolute text-2xl opacity-10"
            style={{
              left: `${15 + i * 18}%`, top: `${10 + (i % 3) * 25}%`,
              animation: `sk-particle-float ${4 + i}s ease-in-out ${i * 0.5}s infinite`,
            }}>
            {c}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 md:px-12 pt-8 pb-3 relative z-10 shrink-0">
        <button
          onClick={onBack}
          disabled={autoRunning}
          className="flex items-center gap-2 rounded-full px-3 py-1.5 font-bold text-sm backdrop-blur-md transition-all hover:scale-105 active:scale-95 disabled:opacity-30"
          style={{ background: "rgba(255,255,255,0.08)", color: textColor, border: "1px solid rgba(255,255,255,0.15)" }}
        >
          <ArrowBigLeft size="20" />
          <span>Kembali</span>
        </button>

        <div className="text-center">
          <span className="text-xl md:text-2xl font-black tracking-[0.15em]" style={{ color: textColor }}>
            SESI FOTO
          </span>
          <div className="h-0.5 w-12 mx-auto mt-1 rounded-full" style={{ background: accentColor }} />
        </div>

        {/* Progress dots */}
        <div className="flex gap-2">
          {Array.from({ length: TOTAL_CAPTURE }).map((_, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full transition-all duration-500"
              style={{
                background: photos[i] ? accentColor : "rgba(255,255,255,0.2)",
                transform: photos[i] ? "scale(1.3)" : "scale(1)",
                boxShadow: photos[i] ? `0 0 8px ${accentColor}` : "none",
              }} />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-4 relative z-10 min-h-0">
        <div className="flex flex-col md:flex-row items-center gap-6 w-full max-w-5xl">

          {/* Camera preview */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl flex-1"
            style={{ border: `3px solid ${borderColor}`, aspectRatio: "4/3", maxWidth: "min(720px, 85vw)" }}>

            {camError ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4" style={{ background: "rgba(0,0,0,0.6)" }}>
                <Camera size="48" color={textColor} style={{ opacity: 0.5 }} />
                <p className="font-medium text-sm text-center px-4" style={{ color: textColor }}>{camError}</p>
                <button onClick={handleRetry} className="flex items-center gap-2 rounded-xl px-5 py-2.5 font-bold text-sm transition-all hover:scale-105"
                  style={{ background: accentColor, color: "#fff" }}>
                  <LoaderLinesAlt size="16" />
                  Coba Lagi
                </button>
              </div>
            ) : (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

                {/* Camera selector */}
                {phase === "ready" && !autoRunning && devices.length > 0 && (
                  <div className="absolute inset-x-0 bottom-0 p-4"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)" }}>
                    <select value={selectedDeviceId} onChange={(e) => setSelectedDeviceId(e.target.value)}
                      className="rounded-xl px-4 py-2 text-sm outline-none font-semibold"
                      style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: `1.5px solid ${borderColor}55` }}>
                      {devices.map((d) => (
                        <option key={d.deviceId} value={d.deviceId} className="bg-[#1a1a2e] text-white">
                          {d.label || `Kamera ${devices.indexOf(d) + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}

            {/* Countdown overlay */}
            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
                <div className="sk-countdown-pop">
                  {countdown === 0
                    ? <Camera size="80" color={accentColor} />
                    : <span className="font-black" style={{ fontSize: 140, color: accentColor, textShadow: `0 0 60px ${accentColor}88` }}>{countdown}</span>
                  }
                </div>
              </div>
            )}

            {/* Counter badge */}
            <div className="absolute top-4 left-4">
              <div className="rounded-xl px-3 py-1.5 text-xs font-bold flex items-center gap-2"
                style={{ background: "rgba(0,0,0,0.6)", color: textColor, backdropFilter: "blur(8px)" }}>
                <Camera size="14" />
                {photos.length}/{TOTAL_CAPTURE} foto
              </div>
            </div>

            {/* Loading next */}
            {autoRunning && countdown === null && photos.length < TOTAL_CAPTURE && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="rounded-xl px-5 py-2 text-sm font-medium flex items-center gap-2"
                  style={{ background: "rgba(0,0,0,0.7)", color: textColor }}>
                  <LoaderLinesAlt size="16" className="animate-spin" />
                  Foto berikutnya...
                </div>
              </div>
            )}
          </div>

          {/* Side: thumbnails + start button */}
          <div className="hidden md:flex flex-col items-center gap-4 shrink-0">
            {/* Thumbnail strip */}
            <div className="rounded-2xl overflow-hidden shadow-xl p-2 flex flex-col gap-1.5"
              style={{ background: "rgba(255,255,255,0.06)", border: `2px solid ${borderColor}55`, width: 110 }}>
              {Array.from({ length: TOTAL_CAPTURE }).map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden flex items-center justify-center"
                  style={{ width: 90, height: 60, background: photos[i] ? "transparent" : "rgba(255,255,255,0.05)", border: `1px solid ${borderColor}44` }}>
                  {photos[i]
                    ? <img src={photos[i]} alt={`f${i}`} className="w-full h-full object-cover" style={{ transform: "scaleX(-1)" }} />
                    : <Camera size="16" color={accentColor} style={{ opacity: 0.3 }} />
                  }
                </div>
              ))}
              <div className="text-center mt-1">
                <span className="text-[9px] font-bold tracking-wider" style={{ color: accentColor }}>SKANIGA</span>
              </div>
            </div>

            <p className="text-xs text-center opacity-50" style={{ color: textColor }}>
              {autoRunning
                ? countdown !== null ? "Berpose! 📸" : photos.length < TOTAL_CAPTURE ? "Siapkan pose..." : "Selesai!"
                : phase === "ready" ? "Tekan untuk mulai" : "Mempersiapkan..."}
            </p>

            {phase === "ready" && !autoRunning && (
              <button
                onClick={runAutoCapture}
                className="w-full px-8 py-4 rounded-2xl font-extrabold text-base uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl flex items-center justify-center gap-3"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, ${borderColor})`,
                  color: "#fff",
                  boxShadow: `0 8px 30px ${accentColor}66`,
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <Camera size="20" />
                Siap! 📸
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: start button */}
      {phase === "ready" && !autoRunning && (
        <div className="md:hidden shrink-0 px-6 pb-6 relative z-10">
          <button
            onClick={runAutoCapture}
            className="w-full py-4 rounded-2xl font-extrabold text-base uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${borderColor})`,
              color: "#fff",
              boxShadow: `0 8px 30px ${accentColor}66`,
            }}
          >
            <Camera size="20" />
            Siap! Ambil {TOTAL_CAPTURE} Foto 📸
          </button>
        </div>
      )}

      <div className="relative z-10 text-center pb-4 shrink-0">
        <p className="text-xs opacity-30" style={{ color: textColor }}>SKANIGA PORTRAIT · 5 Foto · Pilih 3 Terbaik</p>
      </div>

      <style>{`
        @keyframes sk-particle-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(10deg); }
        }
        @keyframes sk-flash {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-flash { animation: sk-flash 0.5s ease-out forwards; pointer-events: none; }
        @keyframes sk-countdown-pop {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        .sk-countdown-pop { animation: sk-countdown-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
      `}</style>
    </div>
  );
}
