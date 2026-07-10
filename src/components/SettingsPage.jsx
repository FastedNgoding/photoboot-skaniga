import { useState } from 'react'

export default function SettingsPage({ config, onSave }) {
  const [pin, setPin] = useState(config.pin || '1234')
  const [mode, setMode] = useState(config.mode || 'bebas')
  const [duration, setDuration] = useState(config.duration || 2)
  const [controlButtonMode, setControlButtonMode] = useState(config.controlButtonMode || 'music')
  const [countdownDuration, setCountdownDuration] = useState(config.countdownDuration || 3)
  const [watermarkText, setWatermarkText] = useState(config.watermarkText || 'SKANIGA PORTRAIT')

  const [freeUploadProvider, setFreeUploadProvider] = useState(config.freeUploadProvider || 'imgbb')
  const [imgbbApiKey, setImgbbApiKey] = useState(config.imgbbApiKey || 'a49272e5e22c14d2e44681221e169088')
  const [imgurClientId, setImgurClientId] = useState(config.imgurClientId || '')
  const [cloudinaryCloudName, setCloudinaryCloudName] = useState(config.cloudinaryCloudName || 'xoawhvbs')
  const [cloudinaryUploadPreset, setCloudinaryUploadPreset] = useState(config.cloudinaryUploadPreset || 'photobooth_assets')
  const [theme, setTheme] = useState(config.theme || 'light')
  const [paidUploadProvider, setPaidUploadProvider] = useState(config.paidUploadProvider || 'imgur')

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [inputPin, setInputPin] = useState('')
  const [pinError, setPinError] = useState(false)

  const handleAuth = (e) => {
    e.preventDefault()
    if (inputPin === (config.pin || '1234')) {
      setIsAuthenticated(true)
      setPinError(false)
    } else {
      setPinError(true)
      setInputPin('')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ 
      pin, 
      mode, 
      duration: Number(duration), 
      controlButtonMode,
      countdownDuration: Number(countdownDuration),
      watermarkText: watermarkText.trim() || 'SKANIGA PORTRAIT',
      freeUploadProvider,
      imgbbApiKey,
      imgurClientId,
      cloudinaryCloudName,
      cloudinaryUploadPreset,
      theme,
      paidUploadProvider
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E8EDF2] sk-font-body px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-[#C2A56D]/10 text-[#C2A56D] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl sk-font-display font-bold text-[#2C3947] mb-6">Akses Pengaturan</h2>
          <form onSubmit={handleAuth}>
            <input
              type="password"
              value={inputPin}
              onChange={(e) => setInputPin(e.target.value)}
              placeholder="Masukkan PIN"
              className={`w-full p-4 text-center text-xl tracking-widest font-bold rounded-xl border-2 outline-none transition-colors mb-4 ${pinError ? 'border-red-500 text-red-500' : 'border-gray-200 focus:border-[#547A95]'}`}
              autoFocus
            />
            {pinError && <p className="text-red-500 text-sm mb-4 font-semibold">PIN Salah!</p>}
            <button type="submit" className="w-full btn-primary rounded-xl px-6 py-3.5 text-lg font-bold">
              Masuk
            </button>
            <button type="button" onClick={() => window.location.href = '/'} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl px-6 py-3.5 text-lg font-bold mt-2 transition-colors">
              Batal
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E8EDF2] sk-font-body px-4 py-8 overflow-y-auto">
      <div className="bg-white !p-8 rounded-3xl shadow-xl w-full max-w-2xl my-auto">
        <h1 className="text-3xl sk-font-display font-bold text-[#2C3947] mb-6 text-center">Pengaturan Web</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <h2 className="text-xl font-bold border-b pb-2 text-[#2C3947]">Utama</h2>
              
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

              {mode === 'berbayar' && (
                <div className="animate-fade-in">
                  <label className="block text-sm font-semibold text-[#547A95] !mb-2">Durasi Berbayar (Menit)</label>
                  <input
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full !p-3 rounded-xl border-2 border-gray-200 focus:border-[#547A95] outline-none transition-colors text-base"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Saat waktu habis, QR otomatis dicetak (Imgur).</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-[#547A95] !mb-2">Tema Aplikasi</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full !p-3 rounded-xl border-2 border-gray-200 focus:border-[#547A95] outline-none font-bold"
                >
                  <option value="light">Sleek Light (Default)</option>
                  <option value="dark">Cyber Dark</option>
                  <option value="gold">Warm Gold</option>
                  <option value="sakura">Sakura Pink</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#547A95] !mb-2">Tombol Kanan Bawah</label>
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
                      Musik 🎵
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

              <div>
                <label className="block text-sm font-semibold text-[#547A95] !mb-2">PIN Admin Baru</label>
                <input
                  type="text"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full !p-3 rounded-xl border-2 border-gray-200 focus:border-[#547A95] outline-none transition-colors text-base tracking-widest font-bold"
                  required
                  placeholder="Masukkan PIN"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-bold border-b pb-2 text-[#2C3947]">Konfigurasi Upload</h2>
              
              <div>
                <label className="block text-sm font-semibold text-[#547A95] !mb-2">Layanan Utama Mode Bebas</label>
                <select 
                  value={freeUploadProvider}
                  onChange={(e) => setFreeUploadProvider(e.target.value)}
                  className="w-full !p-3 rounded-xl border-2 border-gray-200 focus:border-[#547A95] outline-none font-bold"
                >
                  <option value="imgbb">ImgBB</option>
                  <option value="cloudinary">Cloudinary</option>
                  <option value="imgur">Imgur</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#547A95] !mb-2">Layanan Utama Mode Berbayar</label>
                <select 
                  value={paidUploadProvider}
                  onChange={(e) => setPaidUploadProvider(e.target.value)}
                  className="w-full !p-3 rounded-xl border-2 border-gray-200 focus:border-[#547A95] outline-none font-bold"
                >
                  <option value="imgur">Imgur</option>
                  <option value="imgbb">ImgBB</option>
                  <option value="cloudinary">Cloudinary</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Jika pilihan utama gagal, upload otomatis dialihkan ke cadangan lainnya secara bergantian.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#547A95] !mb-2">ImgBB API Key</label>
                <input
                  type="text"
                  value={imgbbApiKey}
                  onChange={(e) => setImgbbApiKey(e.target.value)}
                  className="w-full !p-3 rounded-xl border-2 border-gray-200 focus:border-[#547A95] outline-none text-sm font-mono"
                  placeholder="contoh: ab03a93ae551..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#547A95] !mb-2">Imgur Client ID</label>
                <input
                  type="text"
                  value={imgurClientId}
                  onChange={(e) => setImgurClientId(e.target.value)}
                  className="w-full !p-3 rounded-xl border-2 border-gray-200 focus:border-[#547A95] outline-none text-sm font-mono"
                  placeholder="Client ID dari API Imgur"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#547A95] !mb-2">Cloudinary Cloud Name</label>
                <input
                  type="text"
                  value={cloudinaryCloudName}
                  onChange={(e) => setCloudinaryCloudName(e.target.value)}
                  className="w-full !p-3 rounded-xl border-2 border-gray-200 focus:border-[#547A95] outline-none text-sm font-mono"
                  placeholder="contoh: dlb2wugmt"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#547A95] !mb-2">Cloudinary Upload Preset</label>
                <input
                  type="text"
                  value={cloudinaryUploadPreset}
                  onChange={(e) => setCloudinaryUploadPreset(e.target.value)}
                  className="w-full !p-3 rounded-xl border-2 border-gray-200 focus:border-[#547A95] outline-none text-sm font-mono"
                  placeholder="contoh: photobooth_skaniga"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <button
              type="submit"
              className="flex-1 btn-primary rounded-xl px-6 !py-3.5 text-lg font-bold cursor-pointer"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => window.location.href = '/'}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl px-6 !py-3.5 text-lg font-bold transition-colors cursor-pointer"
            >
              Kembali
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
