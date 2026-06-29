import { useState } from 'react'

export default function SettingsPage({ config, onSave }) {
  const [pin, setPin] = useState(config.pin || '1234')
  const [mode, setMode] = useState(config.mode || 'bebas')
  const [duration, setDuration] = useState(config.duration || 2)
  const [controlButtonMode, setControlButtonMode] = useState(config.controlButtonMode || 'music')
  const [countdownDuration, setCountdownDuration] = useState(config.countdownDuration || 3)
  const [watermarkText, setWatermarkText] = useState(config.watermarkText || 'SKANIGA PORTRAIT')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ 
      pin, 
      mode, 
      duration: Number(duration), 
      controlButtonMode,
      countdownDuration: Number(countdownDuration),
      watermarkText: watermarkText.trim() || 'SKANIGA PORTRAIT'
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E8EDF2] font-body px-4 py-8 overflow-y-auto">
      <div className="bg-white !p-8 rounded-3xl shadow-xl w-full max-w-md my-auto">
        <h1 className="text-3xl font-display font-bold text-[#2C3947] mb-6 text-center">Pengaturan Web</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mode Aplikasi */}
          <div>
            <label className="block text-sm font-semibold text-[#547A95] !mb-2">Mode Aplikasi</label>
            <div className="flex !gap-4">
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="bebas"
                  checked={mode === 'bebas'}
                  onChange={(e) => setMode(e.target.value)}
                  className="sr-only peer"
                />
                <div className="!p-3 text-center rounded-xl border-2 border-gray-200 peer-checked:border-[#C2A56D] peer-checked:bg-[#C2A56D]/10 peer-checked:text-[#C2A56D] font-bold transition-all text-sm">
                  Bebas
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="berbayar"
                  checked={mode === 'berbayar'}
                  onChange={(e) => setMode(e.target.value)}
                  className="sr-only peer"
                />
                <div className="!p-3 text-center rounded-xl border-2 border-gray-200 peer-checked:border-[#C2A56D] peer-checked:bg-[#C2A56D]/10 peer-checked:text-[#C2A56D] font-bold transition-all text-sm">
                  Berbayar
                </div>
              </label>
            </div>
          </div>

          {/* Durasi if berbayar */}
          {mode === 'berbayar' && (
            <div className="animate-fade-in">
              <label className="block text-sm font-semibold text-[#547A95] !mb-2">Durasi (Menit)</label>
              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full !p-3 rounded-xl border-2 border-gray-200 focus:border-[#547A95] outline-none transition-colors text-base"
                required
              />
            </div>
          )}

          {/* Tombol Pojok Kanan Bawah */}
          <div>
            <label className="block text-sm font-semibold text-[#547A95] !mb-2">Tombol Pojok Kanan Bawah</label>
            <div className="flex !gap-4">
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="controlButtonMode"
                  value="music"
                  checked={controlButtonMode === 'music'}
                  onChange={(e) => setControlButtonMode(e.target.value)}
                  className="sr-only peer"
                />
                <div className="!p-3 text-center rounded-xl border-2 border-gray-200 peer-checked:border-[#C2A56D] peer-checked:bg-[#C2A56D]/10 peer-checked:text-[#C2A56D] font-bold transition-all text-sm">
                  Putar Musik 🎵
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="controlButtonMode"
                  value="fullscreen"
                  checked={controlButtonMode === 'fullscreen'}
                  onChange={(e) => setControlButtonMode(e.target.value)}
                  className="sr-only peer"
                />
                <div className="!p-3 text-center rounded-xl border-2 border-gray-200 peer-checked:border-[#C2A56D] peer-checked:bg-[#C2A56D]/10 peer-checked:text-[#C2A56D] font-bold transition-all text-sm">
                  Layar Penuh 📺
                </div>
              </label>
            </div>
          </div>

          {/* Timer Kamera */}
          <div>
            <label className="block text-sm font-semibold text-[#547A95] !mb-2">Timer Kamera</label>
            <div className="flex !gap-3">
              {[3, 5, 7].map((sec) => (
                <label key={sec} className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="countdownDuration"
                    value={sec}
                    checked={countdownDuration === sec}
                    onChange={(e) => setCountdownDuration(Number(e.target.value))}
                    className="sr-only peer"
                  />
                  <div className="!p-2.5 text-center rounded-xl border-2 border-gray-200 peer-checked:border-[#C2A56D] peer-checked:bg-[#C2A56D]/10 peer-checked:text-[#C2A56D] font-bold transition-all text-sm">
                    {sec}s
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Teks Watermark */}
          <div>
            <label className="block text-sm font-semibold text-[#547A95] !mb-2">Teks Footer (Watermark)</label>
            <input
              type="text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              className="w-full !p-3 rounded-xl border-2 border-gray-200 focus:border-[#547A95] outline-none transition-colors text-base font-semibold"
              maxLength={24}
              required
              placeholder="SKANIGA PORTRAIT"
            />
          </div>

          {/* PIN Admin */}
          <div>
            <label className="block text-sm font-semibold text-[#547A95] !mb-2">PIN Admin</label>
            <input
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full !p-3 rounded-xl border-2 border-gray-200 focus:border-[#547A95] outline-none transition-colors text-base tracking-widest font-bold"
              required
              placeholder="Masukkan PIN"
            />
          </div>

          <button
            type="submit"
            className="w-full btn-primary rounded-xl px-6 !py-3.5 text-lg font-bold !mt-4 cursor-pointer"
          >
            Simpan Pengaturan
          </button>
          
          <button
            type="button"
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl !px-6 !py-3.5 text-lg font-bold !mt-2 transition-colors cursor-pointer"
          >
            Kembali
          </button>
        </form>
      </div>
    </div>
  )
}
