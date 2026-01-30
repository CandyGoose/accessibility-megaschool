import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getPublishedGames, getCategories, getCategoryById } from '../data/games'
import './Catalog.css'

const SORT_BY_DATE = 'date'
const SORT_BY_TITLE = 'title'
const ACCESSIBILITY_ALL = ''
const ACCESSIBILITY_SCREEN_READER = 'screenReader'
const ACCESSIBILITY_KEYBOARD = 'keyboard'
const ACCESSIBILITY_SOUND = 'sound'

function Catalog() {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState(SORT_BY_DATE)
  const [categoryId, setCategoryId] = useState('')
  const [accessibility, setAccessibility] = useState(ACCESSIBILITY_ALL)
  const all = getPublishedGames()
  const categories = getCategories()

  const list = useMemo(() => {
    let result = all.filter(
      (g) => (!search.trim() || g.title.toLowerCase().includes(search.trim().toLowerCase()))
        && (!categoryId || g.categoryId === categoryId)
        && (!accessibility || (g.accessibility && g.accessibility[accessibility]))
    )
    if (sortBy === SORT_BY_DATE) {
      result = [...result].sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''))
    } else {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title))
    }
    return result
  }, [all, search, sortBy, categoryId, accessibility])

  return (
    <>
      <h1>Каталог игр</h1>
      <div className="catalog-controls">
        <label className="catalog-controls__label">
          Поиск по названию
          <input
            type="search"
            className="catalog-controls__input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Введите название"
            aria-label="Поиск по названию игры"
          />
        </label>
        <label className="catalog-controls__label">
          Категория
          <select
            className="catalog-controls__select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            aria-label="Фильтр по категории"
          >
            <option value="">Все категории</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="catalog-controls__label">
          Доступность
          <select
            className="catalog-controls__select"
            value={accessibility}
            onChange={(e) => setAccessibility(e.target.value)}
            aria-label="Фильтр по доступности"
          >
            <option value={ACCESSIBILITY_ALL}>Все</option>
            <option value={ACCESSIBILITY_SCREEN_READER}>Скринридер</option>
            <option value={ACCESSIBILITY_KEYBOARD}>Клавиатура</option>
            <option value={ACCESSIBILITY_SOUND}>Звук</option>
          </select>
        </label>
        <label className="catalog-controls__label">
          Сортировка
          <select
            className="catalog-controls__select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Сортировка списка игр"
          >
            <option value={SORT_BY_DATE}>По дате публикации</option>
            <option value={SORT_BY_TITLE}>По названию</option>
          </select>
        </label>
      </div>
      <ul className="catalog-list" aria-label="Список игр">
        {list.map((game) => {
          const cat = getCategoryById(game.categoryId)
          return (
            <li key={game.id} className="catalog-list__item">
              <h2 className="catalog-list__title">
                <Link to={`/games/${game.id}`}>{game.title}</Link>
              </h2>
              <p className="catalog-list__desc">{game.description}</p>
              <p className="catalog-list__meta">
                Автор: {game.authorName}
                {cat && `, категория: ${cat.name}`}
                {(game.accessibility?.screenReader || game.accessibility?.keyboard || game.accessibility?.sound) && (
                  <span className="catalog-list__accessibility">
                    {' · '}
                    {[game.accessibility.screenReader && 'скринридер', game.accessibility.keyboard && 'клавиатура', game.accessibility.sound && 'звук'].filter(Boolean).join(', ')}
                  </span>
                )}
              </p>
            </li>
          )
        })}
      </ul>
      {list.length === 0 && (
        <p className="catalog-empty">Ничего не найдено.</p>
      )}
    </>
  )
}

export default Catalog
