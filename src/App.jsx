import React, { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'kitsFLPro'

export default function App() {
  const [leagues, setLeagues] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leagues))
    } catch {
      alert('No se pudo guardar. El escudo puede ser demasiado grande.')
    }
  }, [leagues])

  function openModal(index = -1) {
    setEditingIndex(index)

    if (index === -1) {
      setName('')
      setUrl('')
      setCrest('')
    } else {
      const league = leagues[index]
      setName(league.name || '')
      setUrl(league.url || '')
      setCrest(league.crest || '')
    }

    if (fileRef.current) {
      fileRef.current.value = ''
    }

    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  function handleFile(event) {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Selecciona una imagen.')
      return
    }

    const reader = new FileReader()

    reader.onload = (event) => {
      setCrest(event.target.result)
    }

    reader.readAsDataURL(file)
  }

  function saveLeague() {
    const trimmedName = name.trim()
    const trimmedUrl = url.trim()

    if (!trimmedName) {
      alert('Escribe el nombre de la liga.')
      return
    }

    if (!trimmedUrl) {
      alert('Pega el enlace de los kits.')
      return
    }

    const league = {
      name: trimmedName,
      url: trimmedUrl,
      crest: crest || ''
    }

    if (editingIndex === -1) {
      setLeagues((current) => [...current, league])
    } else {
      setLeagues((current) =>
        current.map((item, index) =>
          index === editingIndex ? league : item
        )
      )
    }

    closeModal()
  }

  function deleteLeague(index) {
    if (!window.confirm('¿Quieres eliminar esta liga?')) {
      return
    }

    setLeagues((current) =>
      current.filter((_, i) => i !== index)
    )
  }

  function getSafeUrl(value) {
    try {
      const parsed = new URL(value)

      if (
        parsed.protocol === 'http:' ||
        parsed.protocol === 'https:'
      ) {
        return parsed.href
      }
    } catch {
      return '#'
    }

    return '#'
  }

  return (
    <div className="app">

      <header>
        <h1>⚽ Kits FL Pro</h1>
        <p>Tu colección de kits de fútbol</p>
      </header>

      <main className="container">

        <button
          className="add-btn"
          onClick={() => openModal()}
        >
          ＋ Añadir nueva liga
        </button>

        {leagues.length === 0 ? (

          <div className="empty">
            <div className="empty-icon">⚽</div>

            <h3>No hay ligas todavía</h3>

            <p>
              Pulsa el botón de arriba para crear
              tu primera liga.
            </p>
          </div>

        ) : (

          <div className="league-list">

            {leagues.map((league, index) => (

              <article
                className="league"
                key={`${league.name}-${index}`}
              >

                <div className="league-top">

                  {league.crest ? (

                    <img
                      className="crest"
                      src={league.crest}
                      alt={`Escudo de ${league.name}`}
                    />

                  ) : (

                    <div className="crest placeholder">
                      🏆
                    </div>

                  )}

                  <div className="league-info">
                    <h2>{league.name}</h2>
                    <span>Liga</span>
                  </div>

                </div>

                <a
                  className="kits-link"
                  href={getSafeUrl(league.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  👕 Abrir kits
                </a>

                <div className="actions">

                  <button
                    className="edit"
                    onClick={() => openModal(index)}
                  >
                    ✏️ Editar
                  </button>

                  <button
                    className="delete"
                    onClick={() => deleteLeague(index)}
                  >
                    🗑️ Eliminar
                  </button>

                </div>

              </article>

            ))}

          </div>

        )}

      </main>

      {isOpen && (

        <div
          className="modal"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeModal()
            }
          }}
        >

          <div className="modal-box">

            <h2>
              {editingIndex === -1
                ? '🏆 Nueva liga'
                : '✏️ Editar liga'}
            </h2>

            <label htmlFor="leagueName">
              Nombre de la liga
            </label>

            <input
              id="leagueName"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Ej: LaLiga"
            />

            <label htmlFor="kitsUrl">
              Enlace de los kits
            </label>

            <input
              id="kitsUrl"
              type="url"
              value={url}
              onChange={(event) =>
                setUrl(event.target.value)
              }
              placeholder="https://..."
            />

            <label htmlFor="crestFile">
              Escudo de la liga
            </label>

            <input
              ref={fileRef}
              id="crestFile"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFile}
            />

            {crest && (

              <div className="preview-container">

                <img
                  className="preview"
                  src={crest}
                  alt="Vista previa del escudo"
                />

                <button
                  className="remove-crest"
                  onClick={() => setCrest('')}
                >
                  Quitar escudo
                </button>

              </div>

            )}

            <button
              className="save"
              onClick={saveLeague}
            >
              💾 Guardar liga
            </button>

            <button
              className="cancel"
              onClick={closeModal}
            >
              Cancelar
            </button>

          </div>

        </div>

      )}

    </div>
  )
    }
