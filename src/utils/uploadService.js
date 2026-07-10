const IMGBB_API_KEY = "a49272e5e22c14d2e44681221e169088"
const CLOUDINARY_CLOUD = "xoawhvbs"
const CLOUDINARY_PRESET = "photobooth_assets"

export async function upImgBB(b64, key) {
  try {
    const b = b64.replace(/^data:image\/jpeg;base64,/, "")
    const fd = new FormData()
    fd.append("image", b)
    const r = await fetch(
      `https://api.imgbb.com/1/upload?key=${key || IMGBB_API_KEY}`,
      { method: "POST", body: fd }
    )
    const j = await r.json()
    if (j.data && j.data.url)
      return { ok: true, url: j.data.url }
    return { ok: false, err: j.error?.message || "Fail" }
  } catch (e) {
    return { ok: false, err: e.message }
  }
}

export async function upCloud(b64, cloudName, preset) {
  try {
    const fd = new FormData()
    fd.append("file", b64)
    fd.append("upload_preset", preset || CLOUDINARY_PRESET)
    fd.append("folder", "skaniga-portrait")
    const r = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName || CLOUDINARY_CLOUD}/image/upload`,
      { method: "POST", body: fd }
    )
    const d = await r.json()
    if (d.secure_url) return { ok: true, url: d.secure_url }
    return { ok: false, err: d.error?.message || "Fail" }
  } catch (e) {
    return { ok: false, err: e.message }
  }
}

export async function upImgur(b64, clientId) {
  try {
    const b = b64.replace(/^data:image\/jpeg;base64,/, "")
    const fd = new FormData()
    fd.append("image", b)
    const r = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: { Authorization: `Client-ID ${clientId}` },
      body: fd
    })
    const d = await r.json()
    if (d.success) return { ok: true, url: d.data.link, id: d.data.id }
    return { ok: false, err: d.data?.error?.message || d.data?.error || "Imgur upload fail" }
  } catch (e) {
    return { ok: false, err: e.message }
  }
}

export async function uploadStripFree(stripB64, config) {
  const provider = config.freeUploadProvider || 'imgbb'
  let res = { ok: false }

  if (provider === 'imgbb') {
    res = await upImgBB(stripB64, config.imgbbApiKey)
    if (res.ok) return res
  } else if (provider === 'cloudinary') {
    res = await upCloud(stripB64, config.cloudinaryCloudName, config.cloudinaryUploadPreset)
    if (res.ok) return res
  } else if (provider === 'imgur') {
    if (config.imgurClientId) {
      res = await upImgur(stripB64, config.imgurClientId)
      if (res.ok) return res
    }
  }

  if (provider !== 'imgbb') {
    res = await upImgBB(stripB64, config.imgbbApiKey)
    if (res.ok) return res
  }
  if (provider !== 'cloudinary') {
    res = await upCloud(stripB64, config.cloudinaryCloudName, config.cloudinaryUploadPreset)
    if (res.ok) return res
  }
  if (provider !== 'imgur' && config.imgurClientId) {
    res = await upImgur(stripB64, config.imgurClientId)
    if (res.ok) return res
  }

  return { ok: false, err: "Semua layanan upload gagal." }
}

export async function uploadStripPaid(stripB64, config) {
  const provider = config.paidUploadProvider || 'imgur'
  let res = { ok: false }

  if (provider === 'imgur') {
    if (config.imgurClientId) {
      res = await upImgur(stripB64, config.imgurClientId)
      if (res.ok) return { ok: true, url: res.url, id: res.id, provider: 'imgur' }
    }
  } else if (provider === 'imgbb') {
    res = await upImgBB(stripB64, config.imgbbApiKey)
    if (res.ok) return { ok: true, url: res.url, provider: 'imgbb' }
  } else if (provider === 'cloudinary') {
    res = await upCloud(stripB64, config.cloudinaryCloudName, config.cloudinaryUploadPreset)
    if (res.ok) return { ok: true, url: res.url, provider: 'cloudinary' }
  }

  if (provider !== 'imgur' && config.imgurClientId) {
    res = await upImgur(stripB64, config.imgurClientId)
    if (res.ok) return { ok: true, url: res.url, id: res.id, provider: 'imgur' }
  }
  if (provider !== 'cloudinary') {
    res = await upCloud(stripB64, config.cloudinaryCloudName, config.cloudinaryUploadPreset)
    if (res.ok) return { ok: true, url: res.url, provider: 'cloudinary' }
  }
  if (provider !== 'imgbb') {
    res = await upImgBB(stripB64, config.imgbbApiKey)
    if (res.ok) return { ok: true, url: res.url, provider: 'imgbb' }
  }

  return { ok: false, err: "Semua layanan upload gagal." }
}

export function savePaidStripUrl(url) {
  const raw = localStorage.getItem('skaniga-paid-strips')
  const arr = raw ? JSON.parse(raw) : []
  arr.push(url)
  localStorage.setItem('skaniga-paid-strips', JSON.stringify(arr))
}

export function getPaidStripUrls() {
  const raw = localStorage.getItem('skaniga-paid-strips')
  return raw ? JSON.parse(raw) : []
}

export function savePaidImgurId(id) {
  const raw = localStorage.getItem('skaniga-paid-imgur-ids')
  const arr = raw ? JSON.parse(raw) : []
  arr.push(id)
  localStorage.setItem('skaniga-paid-imgur-ids', JSON.stringify(arr))
}

export function getPaidImgurIds() {
  const raw = localStorage.getItem('skaniga-paid-imgur-ids')
  return raw ? JSON.parse(raw) : []
}

export function clearPaidSession() {
  localStorage.removeItem('skaniga-paid-strips')
  localStorage.removeItem('skaniga-paid-imgur-ids')
}

export async function createImgurAlbum(ids, clientId) {
  try {
    const fd = new FormData()
    fd.append("ids", ids.join(","))
    fd.append("title", "Skaniga Portrait Session Album")
    fd.append("privacy", "hidden")

    const r = await fetch("https://api.imgur.com/3/album", {
      method: "POST",
      headers: { Authorization: `Client-ID ${clientId}` },
      body: fd
    })
    const d = await r.json()
    if (d.success) {
      return { ok: true, url: `https://imgur.com/a/${d.data.id}` }
    }
    return { ok: false, err: d.data?.error?.message || d.data?.error || "Gagal membuat album Imgur" }
  } catch (e) {
    return { ok: false, err: e.message }
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    if (src && !src.startsWith("data:")) {
      img.crossOrigin = "anonymous"
    }
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("Gagal memuat gambar: " + src))
    img.src = src
  })
}

export async function buildCollage(urls, watermark) {
  const STRIP_W = 600
  const STRIP_H = 1198
  const COLS = Math.min(urls.length, 3)
  const ROWS = Math.ceil(urls.length / COLS)
  const PADDING = 30
  const GAP = 20
  const THUMB_W = 380
  const THUMB_H = Math.round(THUMB_W * (STRIP_H / STRIP_W))
  const FOOTER = 100

  const totalW = PADDING * 2 + COLS * THUMB_W + (COLS - 1) * GAP
  const totalH = PADDING + ROWS * THUMB_H + (ROWS - 1) * GAP + PADDING + FOOTER

  const cv = document.createElement("canvas")
  cv.width = totalW
  cv.height = totalH
  const c = cv.getContext("2d")

  const grad = c.createLinearGradient(0, 0, totalW, totalH)
  grad.addColorStop(0, "#1a1a2e")
  grad.addColorStop(0.5, "#16213e")
  grad.addColorStop(1, "#0f3460")
  c.fillStyle = grad
  c.fillRect(0, 0, totalW, totalH)

  c.strokeStyle = "#C2A56D"
  c.lineWidth = 4
  c.strokeRect(8, 8, totalW - 16, totalH - 16)
  c.strokeStyle = "#C2A56D33"
  c.lineWidth = 1
  c.strokeRect(18, 18, totalW - 36, totalH - 36)

  const imgs = await Promise.allSettled(urls.map(u => loadImage(u)))

  imgs.forEach((result, i) => {
    const col = i % COLS
    const row = Math.floor(i / COLS)
    const x = PADDING + col * (THUMB_W + GAP)
    const y = PADDING + row * (THUMB_H + GAP)

    c.fillStyle = "#ffffff08"
    c.fillRect(x, y, THUMB_W, THUMB_H)

    if (result.status === "fulfilled") {
      const img = result.value
      const sx = THUMB_W / img.width
      const sy = THUMB_H / img.height
      const s = Math.max(sx, sy)
      const dw = img.width * s
      const dh = img.height * s
      c.save()
      c.beginPath()
      if (c.roundRect) {
        c.roundRect(x, y, THUMB_W, THUMB_H, 12)
      } else {
        c.rect(x, y, THUMB_W, THUMB_H)
      }
      c.clip()
      c.drawImage(img, x + (THUMB_W - dw) / 2, y + (THUMB_H - dh) / 2, dw, dh)
      c.restore()
    } else {
      c.fillStyle = "#ffffff22"
      c.fillRect(x, y, THUMB_W, THUMB_H)
      c.fillStyle = "#ffffff66"
      c.font = '14px "Urbanist", sans-serif'
      c.textAlign = "center"
      c.fillText("Gagal memuat", x + THUMB_W / 2, y + THUMB_H / 2)
    }

    c.strokeStyle = "#C2A56D55"
    c.lineWidth = 2
    c.beginPath()
    if (c.roundRect) {
      c.roundRect(x, y, THUMB_W, THUMB_H, 12)
    } else {
      c.rect(x, y, THUMB_W, THUMB_H)
    }
    c.stroke()

    c.fillStyle = "#00000088"
    c.fillRect(x + THUMB_W - 40, y + 8, 32, 22)
    c.fillStyle = "#ffffff"
    c.font = 'bold 11px "Urbanist", sans-serif'
    c.textAlign = "center"
    c.fillText(`${i + 1}`, x + THUMB_W - 24, y + 23)
  })

  const fy = totalH - FOOTER + 20
  c.font = 'bold 36px "Urbanist", sans-serif'
  c.fillStyle = "#C2A56D"
  c.textAlign = "center"
  c.fillText(watermark || "SKANIGA PORTRAIT", totalW / 2, fy + 10)

  c.strokeStyle = "#C2A56D55"
  c.lineWidth = 1
  c.beginPath()
  c.moveTo(totalW / 2 - 80, fy + 22)
  c.lineTo(totalW / 2 + 80, fy + 22)
  c.stroke()

  c.font = '14px "Urbanist", sans-serif'
  c.fillStyle = "#ffffffaa"
  const dt = new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
  c.fillText(`${urls.length} Foto • ${dt}`, totalW / 2, fy + 44)

  c.font = 'bold 11px "Urbanist", sans-serif'
  c.fillStyle = "#ffffff55"
  c.fillText("SKANIGA PORTRAIT • PHOTOBOOTH", totalW / 2, fy + 64)

  c.textAlign = "left"
  return cv.toDataURL("image/jpeg", 0.92)
}
