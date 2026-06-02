import { useState } from 'react'

export default function SettingsPage({ config, onSave }) {
  const [pin, setPin] = useState(config.pin || '1234')
  const [mode, setMode] = useState(config.mode || 'bebas')
  const [duration, setDuration] = useState(config.duration || 2)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ pin, mode, duration: Number(duration) })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E8EDF2] font-body px-4">
      <div className="bg-white !p-8 rounded-3xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-display font-bold text-[#2C3947] mb-6 text-center">Pengaturan Web</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
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
                <div className="!p-4 text-center rounded-xl border-2 border-gray-200 peer-checked:border-[#C2A56D] peer-checked:bg-[#C2A56D]/10 peer-checked:text-[#C2A56D] font-bold transition-all">
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
                <div className="!p-4 text-center rounded-xl border-2 border-gray-200 peer-checked:border-[#C2A56D] peer-checked:bg-[#C2A56D]/10 peer-checked:text-[#C2A56D] font-bold transition-all">
                  Berbayar
                </div>
              </label>
            </div>
          </div>

          {mode === 'berbayar' && (
            <div className="animate-fade-in">
              <label className="block text-sm font-semibold text-[#547A95] !mb-2 !mt-2">Durasi (Menit)</label>
              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full !p-4 rounded-xl border-2 border-gray-200 focus:border-[#547A95] outline-none transition-colors text-lg"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-[#547A95] !mb-2 !mt-2">PIN Admin</label>
            <input
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full !p-4 rounded-xl border-2 border-gray-200 focus:border-[#547A95] outline-none transition-colors text-lg tracking-widest font-bold"
              required
              placeholder="Masukkan PIN"
            />
          </div>

          <button
            type="submit"
            className="w-full btn-primary rounded-xl px-6 !py-4 text-lg font-bold !mt-4"
          >
            Simpan Pengaturan
          </button>
          
          <button
            type="button"
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl !px-6 !py-4 text-lg font-bold !mt-2 transition-colors"
          >
            Kembali
          </button>
        </form>
      </div>
    </div>
  )
}
