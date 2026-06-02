import { useState } from "react";
import { Lock } from "@boxicons/react";

export default function LockScreen({ onUnlock, pin }) {
  const [inputPin, setInputPin] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputPin === pin) {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-[#2C3947]">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,#E8EDF2_1px,transparent_0)] bg-[length:40px_40px]" />

      <div className="relative z-10 w-full max-w-sm px-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl !p-8 shadow-2xl border border-white/20 text-center">
          <div className="flex !items-center !justify-center">
            <div className="w-20 h-20 bg-[#C2A56D] rounded-full mx-auto flex !items-center !justify-center !mb-6 shadow-lg shadow-[#C2A56D]/30">
              <Lock className="text-white text-4xl" />
            </div>
          </div>

          <h2 className="text-2xl font-display font-bold text-white !mb-2">
            Sesi Habis
          </h2>
          <p className="text-white/70 font-body !mb-8">
            Masukkan PIN admin untuk membuka kunci aplikasi.
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={inputPin}
              onChange={(e) => setInputPin(e.target.value)}
              className={`w-full bg-white/5 border-2 ${error ? "border-red-500" : "border-white/20 focus:border-[#C2A56D]"} rounded-xl !px-6 !py-4 text-center text-2xl tracking-[0.5em] text-white font-bold outline-none transition-colors !mb-6`}
              placeholder="••••"
              maxLength={10}
              autoFocus
            />

            {error && (
              <p className="text-red-400 text-sm font-body !mb-4 animate-shake">
                PIN yang Anda masukkan salah
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-[#C2A56D] hover:bg-[#b0935c] text-white rounded-xl !px-6 !py-4 text-lg font-bold font-body transition-colors shadow-lg shadow-[#C2A56D]/30"
            >
              Buka Kunci
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
