import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_URL = 'https://api.tcgdex.net/v2/en'
const PAGE_SIZE = 60
const cardNumberCollator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

const EMPTY_FILTERS = {
  set: '',
  type: '',
  category: '',
  rarity: '',
  stage: '',
  regulationMark: '',
  legal: '',
  minHp: '',
  maxHp: '',
}

const CARD_TYPES = [
  'Colorless',
  'Darkness',
  'Dragon',
  'Fairy',
  'Fighting',
  'Fire',
  'Grass',
  'Lightning',
  'Metal',
  'Psychic',
  'Water',
]

const RARITIES = [
  'Common',
  'Uncommon',
  'Rare',
  'Rare Holo',
  'Double rare',
  'Ultra rare',
  'Illustration rare',
  'Special illustration rare',
  'Hyper rare',
  'Promo',
  'Amazing rare',
  'Radiant rare',
  'Shiny rare',
  'Shiny ultra rare',
  'ACE SPEC rare',
]

async function fetchJson(url, signal) {
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error(`TCGdex request failed (${response.status})`)
  }
  return response.json()
}

function toLabelValue(value) {
  if (value === null || value === undefined || value === '') return '—'
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return String(value)
}

function formatLabel(label) {
  return label
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/^./, (character) => character.toUpperCase())
}

function App() {
  const [allCards, setAllCards] = useState([])
  const [sets, setSets] = useState([])
  const [filteredCards, setFilteredCards] = useState([])
  const [cardsLoading, setCardsLoading] = useState(true)
  const [filterLoading, setFilterLoading] = useState(false)
  const [listError, setListError] = useState(null)
  const [filterError, setFilterError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [sortOrder, setSortOrder] = useState('set-number')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [selectedCardId, setSelectedCardId] = useState(null)
  const [cardDetail, setCardDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    Promise.all([
      fetchJson(`${API_URL}/cards`, controller.signal),
      fetchJson(`${API_URL}/sets`, controller.signal),
    ])
      .then(([cardData, setData]) => {
        if (!Array.isArray(cardData) || !Array.isArray(setData)) {
          throw new Error('TCGdex returned an unexpected card list.')
        }
        setAllCards(cardData)
        setSets(setData)
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setListError(error.message)
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setCardsLoading(false)
        }
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (cardsLoading) return

    const params = new URLSearchParams()
    if (filters.set) params.set('set.id', filters.set)
    if (filters.type) params.set('types', filters.type)
    if (filters.category) params.set('category', filters.category)
    if (filters.rarity) params.set('rarity', filters.rarity)
    if (filters.stage) params.set('stage', filters.stage)
    if (filters.regulationMark) params.set('regulationMark', filters.regulationMark)
    if (filters.legal) params.set(`legal.${filters.legal}`, 'true')
    if (filters.minHp) params.append('hp', `gte:${filters.minHp}`)
    if (filters.maxHp) params.append('hp', `lte:${filters.maxHp}`)

    if (params.size === 0) {
      setFilteredCards(allCards)
      setFilterError(null)
      setFilterLoading(false)
      return
    }

    const controller = new AbortController()
    setFilterLoading(true)
    setFilterError(null)

    fetchJson(`${API_URL}/cards?${params.toString()}`, controller.signal)
      .then((cardData) => {
        if (!Array.isArray(cardData)) {
          throw new Error('TCGdex returned an unexpected filtered card list.')
        }
        setFilteredCards(cardData)
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setFilterError(error.message)
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setFilterLoading(false)
        }
      })

    return () => controller.abort()
  }, [allCards, cardsLoading, filters])

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [filters, searchTerm, sortOrder])

  useEffect(() => {
    if (!selectedCardId) {
      setCardDetail(null)
      setDetailLoading(false)
      setDetailError(null)
      return
    }

    const controller = new AbortController()
    setCardDetail(null)
    setDetailLoading(true)
    setDetailError(null)

    fetchJson(`${API_URL}/cards/${encodeURIComponent(selectedCardId)}`, controller.signal)
      .then((data) => setCardDetail(data))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setDetailError(error.message)
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setDetailLoading(false)
        }
      })

    return () => controller.abort()
  }, [selectedCardId])

  const setNames = useMemo(() => new Map(sets.map((set) => [set.id, set.name])), [sets])
  const matchingCards = useMemo(() => {
    const search = searchTerm.trim().toLocaleLowerCase()
    let results = filteredCards.filter((card) => {
      if (!search) return true
      const setId = card.id.slice(0, card.id.lastIndexOf('-'))
      const searchableText = `${card.name} ${card.id} ${card.localId} ${setNames.get(setId) || ''}`
      return searchableText.toLocaleLowerCase().includes(search)
    })

    if (sortOrder === 'set-number') {
      results = [...results].sort((a, b) => {
        const setIdA = a.id.slice(0, a.id.lastIndexOf('-'))
        const setIdB = b.id.slice(0, b.id.lastIndexOf('-'))
        const setNameA = setNames.get(setIdA) || setIdA
        const setNameB = setNames.get(setIdB) || setIdB
        const setOrder = setNameA.localeCompare(setNameB)

        return setOrder
          || cardNumberCollator.compare(a.localId, b.localId)
          || a.id.localeCompare(b.id)
      })
    } else if (sortOrder === 'name-asc') {
      results = [...results].sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortOrder === 'name-desc') {
      results = [...results].sort((a, b) => b.name.localeCompare(a.name))
    }

    return results
  }, [filteredCards, searchTerm, setNames, sortOrder])

  const visibleCards = matchingCards.slice(0, visibleCount)
  const cardImage = cardDetail?.image
  const stats = [
    { label: 'HP', value: cardDetail?.hp },
    { label: 'Rarity', value: cardDetail?.rarity },
    { label: 'Stage', value: cardDetail?.category === 'Pokemon' ? cardDetail.stage : null },
    { label: 'Type', value: cardDetail?.category === 'Pokemon' ? cardDetail.types?.join(' / ') : null },
    { label: 'Trainer type', value: cardDetail?.trainerType },
    { label: 'Energy type', value: cardDetail?.energyType },
    { label: 'Retreat', value: cardDetail?.retreat },
    { label: 'Evolves from', value: cardDetail?.evolveFrom },
  ].filter((stat) => stat.value !== null && stat.value !== undefined && stat.value !== '')
  const attacks = cardDetail?.attacks ?? []
  const abilities = cardDetail?.abilities ?? []
  const weaknesses = cardDetail?.weaknesses ?? []
  const legalList = cardDetail?.legal ? Object.entries(cardDetail.legal) : []
  const variantList = cardDetail?.variants
    ? Object.entries(cardDetail.variants).filter(([, value]) => value)
    : []

  function updateFilter(event) {
    const { name, value } = event.target
    setFilters((current) => ({ ...current, [name]: value }))
  }

  function clearFilters() {
    setFilters(EMPTY_FILTERS)
  }

  return (
    <>
      <header className="App">
        <h1>Mimikyu's TCG Dex</h1>
      </header>

      <main>
        <section className="search-container" aria-label="Search and filter cards">
          <form id="search-form" onSubmit={(event) => event.preventDefault()}>
            <input
              type="search"
              id="search"
              name="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search cards, sets, or card numbers..."
              aria-label="Search cards"
            />
          </form>

          <div className="filter-toolbar">
            <label>
              <span>Set</span>
              <select name="set" value={filters.set} onChange={updateFilter}>
                <option value="">All sets</option>
                {sets.map((set) => (
                  <option key={set.id} value={set.id}>{set.name}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Type</span>
              <select name="type" value={filters.type} onChange={updateFilter}>
                <option value="">All types</option>
                {CARD_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </label>

            <label>
              <span>Card kind</span>
              <select name="category" value={filters.category} onChange={updateFilter}>
                <option value="">All kinds</option>
                <option value="Pokemon">Pokémon</option>
                <option value="Trainer">Trainer</option>
                <option value="Energy">Energy</option>
              </select>
            </label>

            <label>
              <span>Rarity</span>
              <select name="rarity" value={filters.rarity} onChange={updateFilter}>
                <option value="">All rarities</option>
                {RARITIES.map((rarity) => <option key={rarity} value={rarity}>{rarity}</option>)}
              </select>
            </label>

            <label>
              <span>Stage</span>
              <select name="stage" value={filters.stage} onChange={updateFilter}>
                <option value="">All stages</option>
                {['Basic', 'Stage1', 'Stage2', 'VSTAR', 'VMAX', 'BREAK', 'Restored'].map((stage) => (
                  <option key={stage} value={stage}>{formatLabel(stage)}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Regulation mark</span>
              <select name="regulationMark" value={filters.regulationMark} onChange={updateFilter}>
                <option value="">Any mark</option>
                {'ABCDEFGHI'.split('').map((mark) => <option key={mark} value={mark}>{mark}</option>)}
              </select>
            </label>

            <label>
              <span>HP minimum</span>
              <select name="minHp" value={filters.minHp} onChange={updateFilter}>
                <option value="">Any HP</option>
                {[30, 50, 70, 90, 110, 130, 150, 200].map((hp) => (
                  <option key={hp} value={hp}>{hp}+</option>
                ))}
              </select>
            </label>

            <label>
              <span>HP maximum</span>
              <select name="maxHp" value={filters.maxHp} onChange={updateFilter}>
                <option value="">Any HP</option>
                {[50, 70, 90, 110, 130, 150, 200].map((hp) => (
                  <option key={hp} value={hp}>Up to {hp}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Format legality</span>
              <select name="legal" value={filters.legal} onChange={updateFilter}>
                <option value="">Any format</option>
                <option value="standard">Standard legal</option>
                <option value="expanded">Expanded legal</option>
              </select>
            </label>

            <label>
              <span>Sort by</span>
              <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
                <option value="set-number">Set, then card number</option>
                <option value="name-asc">Name A–Z</option>
                <option value="name-desc">Name Z–A</option>
              </select>
            </label>

            <button type="button" className="clear-filters" onClick={clearFilters}>Clear filters</button>
          </div>
        </section>

        <div className="results-heading">
          <h2>Cards</h2>
          {!cardsLoading && !filterLoading && !filterError && (
            <span>{matchingCards.length.toLocaleString()} found</span>
          )}
        </div>

        {cardsLoading && <p className="list-message">Loading the TCGdex card catalog...</p>}
        {!cardsLoading && listError && <p className="list-message error-message">{listError}</p>}
        {!cardsLoading && !listError && filterLoading && <p className="list-message">Applying filters...</p>}
        {!cardsLoading && !listError && filterError && (
          <p className="list-message error-message">Could not apply filters: {filterError}</p>
        )}

        {!cardsLoading && !listError && !filterLoading && !filterError && matchingCards.length === 0 && (
          <p className="list-message">No cards match your search and filters.</p>
        )}

        {!cardsLoading && !listError && !filterLoading && !filterError && matchingCards.length > 0 && (
          <>
            <div id="card-container">
              {visibleCards.map((card) => {
                const setId = card.id.slice(0, card.id.lastIndexOf('-'))
                return (
                  <button
                    type="button"
                    className="gallery-card"
                    key={card.id}
                    onClick={() => setSelectedCardId(card.id)}
                  >
                    {card.image ? (
                      <img src={`${card.image}/low.png`} alt="" loading="lazy" />
                    ) : (
                      <span className="card-placeholder" aria-hidden="true">No image</span>
                    )}
                    <span className="gallery-card-copy">
                      <strong>{card.name}</strong>
                      <span>{setNames.get(setId) || setId} · #{card.localId}</span>
                    </span>
                  </button>
                )
              })}
            </div>
            {visibleCount < matchingCards.length && (
              <div className="load-more-row">
                <button type="button" className="load-more-button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
                  Load more cards
                </button>
                <span>Showing {visibleCards.length.toLocaleString()} of {matchingCards.length.toLocaleString()}</span>
              </div>
            )}
          </>
        )}
      </main>

      {selectedCardId && (
        <div className="modal-backdrop" onClick={() => setSelectedCardId(null)}>
          {detailLoading && (
            <div className="modal-card error-card" onClick={(event) => event.stopPropagation()}>
              <button type="button" className="modal-close" aria-label="Close card details" onClick={() => setSelectedCardId(null)}>×</button>
              <h2>Loading card details...</h2>
            </div>
          )}

          {!detailLoading && cardDetail && (
            <div
              className="modal-card"
              role="dialog"
              aria-modal="true"
              aria-labelledby="card-detail-title"
              onClick={(event) => event.stopPropagation()}
            >
              <button type="button" className="modal-close" aria-label="Close card details" onClick={() => setSelectedCardId(null)}>×</button>

              <div className="card-shell">
                <div className="card-visual">
                  <div className="image-frame">
                    <img className="modal-image" src={`${cardImage}/high.png`} alt={cardDetail.name || 'Pokémon card'} />
                  </div>
                  <div className="badge-row">
                    {cardDetail.rarity && <span className="badge">{cardDetail.rarity}</span>}
                    {cardDetail.category && <span className="badge muted">{cardDetail.category}</span>}
                  </div>
                </div>

                <div className="card-data">
                  <div className="title-row">
                    <div>
                      <p className="eyebrow">
                        {cardDetail.category === 'Pokemon' ? 'Pokémon' : cardDetail.category || 'Trading Card'}
                      </p>
                      <h2 id="card-detail-title">{cardDetail.name}</h2>
                    </div>
                    {cardDetail.hp && <span className="hp-pill">HP {cardDetail.hp}</span>}
                  </div>

                  <div className="meta-row">
                    <span>{cardDetail.set?.name || 'Unknown set'}</span>
                    <span>#{cardDetail.localId || '—'}</span>
                    {cardDetail.category === 'Pokemon' && cardDetail.types?.length > 0 && (
                      <span>{cardDetail.types.join(' / ')}</span>
                    )}
                    {cardDetail.stage && <span>{formatLabel(cardDetail.stage)}</span>}
                    {cardDetail.regulationMark && <span>Regulation {cardDetail.regulationMark}</span>}
                  </div>

                  {cardDetail.description && (
                    <div className="description-box">
                      <h3>Pokédex entry</h3>
                      <p>{cardDetail.description}</p>
                    </div>
                  )}

                  {stats.length > 0 && (
                    <div className="stat-grid">
                      {stats.map((stat) => (
                        <div key={stat.label} className="stat-box">
                          <span>{stat.label}</span>
                          <strong>{stat.value}</strong>
                        </div>
                      ))}
                    </div>
                  )}

                  {cardDetail.effect && (
                    <div className="description-box">
                      <h3>{cardDetail.category === 'Energy' ? 'Energy effect' : 'Card effect'}</h3>
                      <p>{cardDetail.effect}</p>
                    </div>
                  )}

                  {abilities.length > 0 && (
                    <div className="content-box">
                      <h3>Abilities</h3>
                      <div className="attack-list">
                        {abilities.map((ability, index) => (
                          <div key={`${ability.name}-${index}`} className="attack-item">
                            <div className="attack-head">
                              <strong>{ability.name}</strong>
                              {ability.type && <span>{ability.type}</span>}
                            </div>
                            <small>{ability.effect}</small>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {attacks.length > 0 && (
                    <div className="content-box">
                      <h3>Attacks</h3>
                      <div className="attack-list">
                        {attacks.map((attack, index) => (
                          <div key={`${attack.name}-${index}`} className="attack-item">
                            <div className="attack-head">
                              <strong>{attack.name}</strong>
                              {attack.damage && <span>{attack.damage} dmg</span>}
                            </div>
                            <p>{attack.cost?.join(' / ') || '—'}</p>
                            <small>{attack.effect || 'No effect text available.'}</small>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {weaknesses.length > 0 && (
                    <div className="content-box">
                      <h3>Weaknesses</h3>
                      <div className="pill-list">
                        {weaknesses.map((weakness, index) => (
                          <span key={`${weakness.type}-${index}`} className="pill">{weakness.type} {weakness.value}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bottom-grid">
                    {legalList.length > 0 && (
                      <div className="content-box">
                        <h3>Legal</h3>
                        <div className="pill-list">
                          {legalList.map(([label, value]) => (
                            <span key={label} className="pill soft">{formatLabel(label)}: {toLabelValue(value)}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {variantList.length > 0 && (
                      <div className="content-box">
                        <h3>Variants</h3>
                        <div className="pill-list">
                          {variantList.map(([label]) => (
                            <span key={label} className="pill soft">{formatLabel(label)}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="footer-row">
                    {cardDetail.illustrator && <span>Illustrator: {cardDetail.illustrator}</span>}
                    {cardDetail.set?.id && <span>Set ID: {cardDetail.set.id}</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!detailLoading && !cardDetail && detailError && (
            <div className="modal-card error-card" onClick={(event) => event.stopPropagation()}>
              <button type="button" className="modal-close" aria-label="Close card details" onClick={() => setSelectedCardId(null)}>×</button>
              <h2>Card data unavailable</h2>
              <p>{detailError}</p>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default App
