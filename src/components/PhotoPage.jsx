import { useState, useRef, useEffect, useCallback } from "react";
import {
  Camera,
  ArrowBigLeft,
  Check,
  LoaderLinesAlt,
  ArrowRight,
  Image as ImageIcon,
  X
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
  const [selected, setSelected] = useState([]); // Array of indices (max 3), order matters!

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
    await new Promise((r) => setTimeout(r, 150));
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
      if (prev.length >= PICK_COUNT) return prev; 
      return [...prev, idx];
    });
  };

  const removeSlot = (slotIndex) => {
    setSelected((prev) => {
      const newSel = [...prev];
      newSel.splice(slotIndex, 1);
      return newSel;
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

  if (phase === "selecting") {
    return (
      <div className="fixed inset-0 flex flex-col overflow-hidden select-none" style={{ background: "#0a0a0f" }}>
        
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] bg-purple-600/20 pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] bg-blue-600/20 pointer-events-none" />

        <div className="flex items-center justify-between px-6 md:px-12 pt-8 pb-4 shrink-0 relative z-10">
          <button
            onClick={handleRetakeAll}
            className="flex items-center gap-2 rounded-full px-4 py-2 font-bold text-sm backdrop-blur-md transition-all hover:scale-105 active:scale-95 text-white/80 border border-white/10 bg-white/5"
          >
            <ArrowBigLeft size="18" />
            Ulangi Foto
          </button>
          <div className="text-center absolute left-1/2 -translate-x-1/2">
            <p className="text-xl md:text-2xl font-black tracking-[0.2em] text-white">PILIH FOTO</p>
            <div className="h-0.5 w-12 mx-auto mt-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
          </div>
        </div>

        <p className="text-center text-sm text-white/50 font-medium pb-4 shrink-0 px-4 relative z-10">
          Pilih 3 foto terbaik untuk dicetak ke dalam strip.
        </p>

        <div className="flex-1 flex flex-col items-center justify-center px-4 min-h-0 relative z-10 w-full mx-auto overflow-y-auto">
          
          <div className="w-full flex justify-center gap-3 md:gap-6 mb-8 md:mb-12">
            {[0, 1, 2].map(slotIndex => {
              const photoIdx = selected[slotIndex];
              const isFilled = photoIdx !== undefined;

              return (
                <div key={slotIndex} className="relative flex flex-col items-center">
                  <div 
                    onClick={() => isFilled && removeSlot(slotIndex)}
                    className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 shadow-xl"
                    style={{
                      width: 'clamp(90px, 22vw, 160px)',
                      aspectRatio: '4/3',
                      background: isFilled ? 'transparent' : 'rgba(255,255,255,0.03)',
                      border: isFilled ? '2px solid #a855f7' : '2px dashed rgba(255,255,255,0.2)',
                      boxShadow: isFilled ? '0 0 20px rgba(168,85,247,0.3)' : 'none',
                    }}
                  >
                    {isFilled ? (
                      <>
                        <img src={photos[photoIdx]} alt={`Slot ${slotIndex + 1}`} className="w-full h-full object-cover transform -scale-x-100" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                          <X size="32" color="#fff" />
                        </div>
                        <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center shadow-lg border border-white/20">
                          <span className="text-white text-xs font-black">{slotIndex + 1}</span>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 gap-2">
                        <ImageIcon size="32" />
                        <span className="text-xs font-bold uppercase tracking-widest">Pilih {slotIndex + 1}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-full flex flex-col items-center">
            <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3 px-2" style={{ marginBottom: "10px", marginTop: "10px" }}>Hasil Jepretan ({TOTAL_CAPTURE})</p>
            <div className="flex flex-wrap gap-3 md:gap-4 pb-4 px-2 justify-center max-w-4xl">
              {photos.map((photo, idx) => {
                const rank = selected.indexOf(idx);
                const isSelected = rank !== -1;
                const isMaxed = selected.length >= PICK_COUNT && !isSelected;
                
                return (
                  <button
                    key={idx}
                    onClick={() => toggleSelect(idx)}
                    disabled={isMaxed}
                    className="relative shrink-0 rounded-xl overflow-hidden outline-none border-none cursor-pointer transition-all duration-300 snap-center"
                    style={{
                      width: 'clamp(120px, 28vw, 180px)',
                      aspectRatio: '4/3',
                      opacity: isMaxed ? 0.3 : 1,
                      transform: isSelected ? "scale(0.95)" : "scale(1)",
                      boxShadow: isSelected
                        ? "0 0 0 3px #a855f7"
                        : "0 10px 25px rgba(0,0,0,0.5)",
                    }}
                  >
                    <img src={photo} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover transform -scale-x-100" />
                    
                    {!isSelected && (
                      <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/10">
                        <span className="text-white/70 text-[10px] font-bold">{idx + 1}</span>
                      </div>
                    )}

                    {isSelected && (
                      <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center backdrop-blur-[2px]">
                        <div className="w-10 h-10 rounded-full bg-purple-500 shadow-xl flex items-center justify-center border-2 border-white/20">
                          <Check size="24" color="#fff" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="shrink-0 px-4 pb-8 pt-4 flex flex-col items-center gap-3 relative z-10 bg-gradient-to-t from-[#0a0a0f] to-transparent">
          <button
            onClick={handleConfirmSelection}
            disabled={selected.length !== PICK_COUNT}
            className="flex items-center justify-center gap-3 w-full max-w-sm rounded-2xl py-4 font-black text-sm md:text-base uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              background: selected.length === PICK_COUNT ? "linear-gradient(135deg, #a855f7, #3b82f6)" : "rgba(255,255,255,0.05)",
              color: selected.length === PICK_COUNT ? "#fff" : "rgba(255,255,255,0.4)",
              boxShadow: selected.length === PICK_COUNT ? "0 10px 30px rgba(168,85,247,0.4)" : "none",
              border: selected.length === PICK_COUNT ? "none" : "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {selected.length === PICK_COUNT ? (
              <><span>Pilih Frame</span><ArrowRight size="20" /></>
            ) : (
              <span>Pilih {PICK_COUNT - selected.length} Foto Lagi</span>
            )}
          </button>
        </div>

        <style>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
    );
  }

  
  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-black select-none">
      <canvas ref={canvasRef} className="hidden" />

      {showFlash && (
        <div className="fixed inset-0 z-50 bg-white" style={{ animation: "flash 0.5s ease-out forwards" }} />
      )}

      <div className="absolute top-0 inset-x-0 z-20 bg-gradient-to-b from-black/80 to-transparent pt-8 pb-6 px-6 md:px-12 flex items-center justify-between pointer-events-none">
        <button
          onClick={onBack}
          disabled={autoRunning}
          className="pointer-events-auto flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white transition-all hover:bg-white/20 active:scale-90 disabled:opacity-30 ml-4 mt-5"
        >
          <ArrowBigLeft size="20" />
        </button>

        <div className="flex gap-2.5 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
          {Array.from({ length: TOTAL_CAPTURE }).map((_, i) => (
            <div key={i} className="transition-all duration-500 rounded-full"
              style={{
                width: photos[i] ? 18 : 8,
                height: 8,
                background: photos[i] ? '#a855f7' : 'rgba(255,255,255,0.3)',
                boxShadow: photos[i] ? '0 0 10px #a855f7' : 'none',
              }} />
          ))}
        </div>

        <div className="w-10 h-10" /> {/* Balancer */}
      </div>

      <div className="flex-1 relative w-full h-full flex items-center justify-center bg-[#050505] p-5 md:p-6 pb-24 md:pb-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-[1400px] h-full max-h-[85vh]">
          
          <div className="relative w-full h-full mx-auto md:rounded-[40px] overflow-hidden flex flex-1 items-center justify-center shadow-2xl">
            
            {camError ? (
            <div className="flex flex-col items-center gap-4 p-8 text-center bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
              <Camera size="56" className="text-white/40" />
              <p className="font-medium text-white/80">{camError}</p>
              <button onClick={handleRetry} className="flex items-center gap-2 rounded-xl px-6 py-3 font-bold text-sm bg-white/10 hover:bg-white/20 text-white transition-all">
                <LoaderLinesAlt size="16" /> Coba Lagi
              </button>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Video view with grid overlay */}
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
              
              {/* Camera Grid Lines (Rule of thirds) */}
              {phase === "ready" && (
                <div className="absolute inset-0 pointer-events-none opacity-20">
                  <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                  <div className="absolute top-2/3 left-0 right-0 h-[1px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                  <div className="absolute left-1/3 top-0 bottom-0 w-[1px] bg-white shadow-[1px_0_2px_rgba(0,0,0,0.5)]" />
                  <div className="absolute left-2/3 top-0 bottom-0 w-[1px] bg-white shadow-[1px_0_2px_rgba(0,0,0,0.5)]" />
                </div>
              )}

              {/* Countdown overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
                  {countdown === 0 ? (
                    <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center animate-ping">
                      <Camera size="60" color="#fff" />
                    </div>
                  ) : (
                    <span className="font-black text-white drop-shadow-[0_0_40px_rgba(168,85,247,0.8)] sk-countdown-text" style={{ fontSize: 'clamp(120px, 20vw, 250px)' }}>
                      {countdown}
                    </span>
                  )}
                </div>
              )}

              <div className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-4 pointer-events-none">
                
                {/* Camera selector (Desktop only basically) */}
                {phase === "ready" && !autoRunning && devices.length > 1 && (
                  <select value={selectedDeviceId} onChange={(e) => setSelectedDeviceId(e.target.value)}
                    className="pointer-events-auto appearance-none rounded-full px-6 py-2.5 text-xs font-bold tracking-widest uppercase outline-none bg-black/50 backdrop-blur-md text-white border border-white/20 hover:bg-black/70 transition-colors text-center text-center-last">
                    {devices.map((d, i) => (
                      <option key={d.deviceId} value={d.deviceId} className="bg-[#111] text-white text-center">
                        {d.label || `Kamera ${i + 1}`}
                      </option>
                    ))}
                  </select>
                )}

                {phase === "ready" && !autoRunning && (
                  <button
                    onClick={runAutoCapture}
                    className="pointer-events-auto relative group flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 backdrop-blur-md border-[3px] border-white transition-all hover:scale-105 active:scale-95"
                  >
                    <div className="absolute inset-2 bg-white rounded-full transition-all group-hover:scale-95" />
                  </button>
                )}

                {autoRunning && countdown === null && photos.length < TOTAL_CAPTURE && (
                  <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10">
                    <LoaderLinesAlt size="16" className="animate-spin" />
                    <span className="text-sm font-bold tracking-widest uppercase">Menyiapkan...</span>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        <div className="hidden md:flex flex-col gap-2 p-2 rounded-[24px] bg-white/5 border border-white/10 backdrop-blur-md shrink-0">
          {Array.from({ length: TOTAL_CAPTURE }).map((_, i) => (
            <div key={i} className="w-[160px] h-[120px] rounded-[16px] overflow-hidden border border-white/10 flex items-center justify-center bg-black/50 relative">
              {photos[i] ? (
                <>
                  <img src={photos[i]} className="w-full h-full object-cover transform -scale-x-100" alt="" />
                  <div className="absolute inset-0 border-[3px] border-[#a855f7] rounded-[16px] pointer-events-none" />
                </>
              ) : (
                <Camera size="24" className="text-white/20" />
              )}
              <div className="absolute top-1 right-1 bg-black/60 rounded-full w-5 h-5 flex items-center justify-center">
                <span className="text-[10px] text-white/70 font-bold">{i + 1}</span>
              </div>
            </div>
          ))}
          <div className="text-center pt-1 pb-1">
            <span className="text-[10px] font-black text-[#a855f7] tracking-widest">SKANIGA</span>
          </div>
        </div>

      </div>
    </div>

      <style>{`
        @keyframes flash {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes countdown-pop {
          0% { transform: scale(0.5); opacity: 0; }
          40% { transform: scale(1.1); opacity: 1; }
          60% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0; }
        }
        .sk-countdown-text { animation: countdown-pop 1s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .text-center-last { text-align-last: center; }
      `}</style>
    </div>
  );
}
