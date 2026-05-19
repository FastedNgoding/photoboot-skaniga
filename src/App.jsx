import { useState } from 'react'
import LandingPage from './components/LandingPage'
import TemplatePage from './components/TemplatePage'
import PhotoPage from './components/PhotoPage'
import FinalPage from './components/FinalPage'
import MusicControl from './components/MusicControl'
import { useMusicPlayer } from './hooks/useMusicPlayer'

export default function App() {
  const [page, setPage] = useState('landing')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [capturedPhotos, setCapturedPhotos] = useState([])
  const { isPlaying, toggle, volume, setVolume, tracks, tryAutoPlay } = useMusicPlayer()

  const handleStart = () => {
    tryAutoPlay()
    setPage('template')
  }

  const handleTemplateSelect = (tmpl) => {
    setSelectedTemplate(tmpl)
    setPage('photo')
  }

  const handlePhotosComplete = (photos) => {
    setCapturedPhotos(photos)
    setPage('final')
  }

  const handleRestart = () => {
    setCapturedPhotos([])
    setSelectedTemplate(null)
    setPage('landing')
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Urbanist, sans-serif' }}>
      {page === 'landing' && (
        <LandingPage onStart={handleStart} />
      )}
      {page === 'template' && (
        <TemplatePage
          onSelect={handleTemplateSelect}
          onBack={() => setPage('landing')}
        />
      )}
      {page === 'photo' && selectedTemplate && (
        <PhotoPage
          template={selectedTemplate}
          onComplete={handlePhotosComplete}
          onBack={() => setPage('template')}
        />
      )}
      {page === 'final' && selectedTemplate && capturedPhotos.length > 0 && (
        <FinalPage
          photos={capturedPhotos}
          template={selectedTemplate}
          onRestart={handleRestart}
        />
      )}
      <MusicControl
        isPlaying={isPlaying}
        toggle={toggle}
        volume={volume}
        setVolume={setVolume}
        tracks={tracks}
      />
    </div>
  )
}
