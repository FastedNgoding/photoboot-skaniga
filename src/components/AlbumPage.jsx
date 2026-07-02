export default function AlbumPage({ imageUrls }) {
  return (
    <div
      className="min-h-screen text-white flex flex-col items-center py-12 px-4"
      style={{
        fontFamily: "Urbanist, sans-serif",
        background:
          "linear-gradient(135deg, #0e0e18 0%, #16162a 50%, #0e0e18 100%)",
      }}
    >
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-block px-4 py-1.5 mt-5 rounded-full bg-[#C2A56D]/10 border border-[#C2A56D]/30 text-xs font-bold text-[#C2A56D] uppercase tracking-widest">
          Skaniga Album
        </div>
        <h1 className="text-4xl font-display font-extrabold tracking-wider bg-gradient-to-r from-[#C2A56D] via-white to-[#C2A56D] bg-clip-text text-transparent">
          SKANIGA PORTRAIT
        </h1>
        <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
          Terima kasih telah menggunakan photobooth kami. Berikut adalah
          foto-foto hasil sesi Anda:
        </p>

        {imageUrls.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center backdrop-blur-md">
            <p className="text-gray-400">Tidak ada foto ditemukan.</p>
          </div>
        ) : (
          <div className="space-y-8 pt-4">
            {imageUrls.map((url, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4 shadow-2xl backdrop-blur-md relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#C2A56D]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="flex justify-between items-center relative z-10 border-b border-white/5 pb-2">
                  <span className="text-xs font-black text-[#C2A56D] tracking-widest uppercase">
                    Foto #{index + 1}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">
                    Stripe
                  </span>
                </div>
                <img
                  src={url}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-auto rounded-2xl border border-white/10 shadow-lg object-contain bg-black/20"
                  style={{ maxHeight: "75vh" }}
                />
                <div className="space-y-2 relative z-10">
                  <a
                    href={url}
                    download={`skaniga-portrait-${index + 1}.jpg`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-[#C2A56D] hover:bg-[#b1945c] text-[#0a0a0f] font-black rounded-2xl py-4 text-center block transition-all duration-300 transform active:scale-95 shadow-lg shadow-[#C2A56D]/15 flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download Foto
                  </a>
                </div>
              </div>
            ))}

            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 text-center backdrop-blur-md space-y-2">
              <p className="text-xs text-[#C2A56D] font-bold">
                💡 Tips untuk Pengguna HP:
              </p>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Jika tombol download tidak bekerja secara otomatis di HP Anda,
                tahan lama pada foto lalu pilih <strong>"Simpan Gambar"</strong>{" "}
                atau <strong>"Download Gambar"</strong>.
              </p>
            </div>
          </div>
        )}

        <div className="pt-8 border-t border-white/5">
          <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">
            Studio Foto Digital · Gen-Z Edition
          </p>
        </div>
      </div>
    </div>
  );
}
