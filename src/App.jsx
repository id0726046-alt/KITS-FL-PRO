import React, { useEffect, useState, useRef } from 'react'

const STORAGE_KEY = 'kitsFLPro'

export default function App() {
  const [leagues, setLeagues] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    } catch (e) {
      return []
    }
  })

  const [isOpen, setIsOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState(-1)
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [crest, setCrest] = useState('')
  const fileRef = useRef(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leagues))
  }, [leagues])

  function openModal(index = -1) {
    setEditingIndex(index)
    if (index === -1) {
      setName('')
      setUrl('')
      setCrest('')
    } else {
      const l = leagues[index]
      setName(l.name)
      setUrl(l.url)
      setCrest(l.crest || '')
    }
    if (fileRef.current) fileRef.current.value = ''
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setCrest(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  function saveLeague() {
    const trimmedName = name.trim()
    const trimmedUrl = url.trim()
    if (!trimmedName) return alert('Escribe el nombre de la liga.')
    if (!trimmedUrl) return alert('Pega el enlace de los kits.')
    const league = { name: trimmedName, url: trimmedUrl, crest }
    if (editingIndex === -1) {
      setLeagues((s) => [...s, league])
    } else {
      setLeagues((s) => s.map((it, i) => (i === editingIndex ? league : it)))
    }
    closeModal()
  }

  function deleteLeague(index) {
    if (!confirm('¿Eliminar esta liga?')) return
    setLeagues((s) => s.filter((_, i) => i !== index))
  }

  function escapeURL(u) {
    try {
      const parsed = new URL(u)
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return parsed.href
    } catch (e) {}
    return '#'
  }

  return (
    <div>
      <header>
        <h1>⚽ Kits FL Pro</h1>
      </header>

      <div className="container">
        <button className="add-btn" onClick={() => openModal(-1)}>＋ Añadir nueva liga</button>

        <div id="leagues">
          {leagues.length === 0 ? (
            <div className="empty">
              <h3>⚽ No hay ligas todavía</h3>
              <p>Pulsa ＋ para crear tu primera liga.</p>
            </div>
          ) : (
            leagues.map((league, index) => (
              <div key={index} className="league">
                <div className="league-top">
                  {league.crest ? (
                    <img className="crest" src={league.crest} alt="Escudo" />
                  ) : (
                    <div className="crest placeholder">🏆</div>
                  )}

                  <h2>{league.name}</h2>
                </div>

                <a className="kits-link" href={escapeURL(league.url)} target="_blank" rel="noopener noreferrer">👕 Abrir kits</a>

                <div className="actions">
                  <button className="edit" onClick={() => openModal(index)}>✏️ Editar</button>
                  <button className="delete" onClick={() => deleteLeague(index)}>🗑️ Eliminar</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isOpen && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-box">
            <h2 id="modalTitle">{editingIndex === -1 ? '🏆 Nueva liga' : '✏️ Editar liga'}</h2>

            <label>Nombre de la liga</label>
            <input value={name} onChange={(e) => setName(e.target.value)} id="leagueName" type="text" placeholder="Ej: LaLiga" />

            <label>Enlace de los kits</label>
            <input value={url} onChange={(e) => setUrl(e.target.value)} id="kitsUrl" type="url" placeholder="https://..." />

            <label>Escudo de la liga</label>
            <input ref={fileRef} id="crestFile" type="file" accept="image/*" onChange={handleFile} />

            {crest && <img id="preview" className="preview" alt="Escudo" src={crest} />}

            <button className="save" onClick={saveLeague}>💾 Guardar liga</button>
            <button className="cancel" onClick={closeModal}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )
}
