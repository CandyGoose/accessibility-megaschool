import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { addGame, getCategories, GAME_FORMATS } from '../data/games'
import './AddGame.css'

function AddGame() {
  const navigate = useNavigate()
  const { user, isAuthor } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [gameFormat, setGameFormat] = useState('html')
  const [archiveFile, setArchiveFile] = useState(null)
  const [categoryId, setCategoryId] = useState('other')
  const [keyboard, setKeyboard] = useState(false)
  const [sound, setSound] = useState(false)
  const [screenReader, setScreenReader] = useState(false)
  const [platformMobile, setPlatformMobile] = useState(true)
  const [platformDesktop, setPlatformDesktop] = useState(true)
  const categories = getCategories()

  if (!user || !isAuthor) {
    return (
      <>
        <h1>Доступ запрещен</h1>
        <p>Чтобы добавлять игры, войдите как автор.</p>
        <p><Link to="/login">Войти</Link></p>
      </>
    )
  }

  function handleSubmit(e) {
    e.preventDefault()
    addGame({
      title: title.trim(),
      description: description.trim(),
      playUrl: '',
      gameFormat: gameFormat || 'html',
      archiveFileName: archiveFile?.name ?? '',
      authorName: user.name,
      authorId: user.id,
      categoryId: categoryId || 'other',
      accessibility: { keyboard, sound, screenReader },
      platforms: { mobile: platformMobile, desktop: platformDesktop },
    })
    navigate('/my-games')
  }

  return (
    <>
      <h1>Добавить игру</h1>
      <p className="add-game-form__notice" role="note">
        Загружать можно только игры, предназначенные для слабовидящих пользователей.
      </p>
      <form className="add-game-form" onSubmit={handleSubmit} aria-label="Форма добавления игры">
        <label className="add-game-form__label">
          Название
          <input
            type="text"
            className="add-game-form__input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            aria-required="true"
          />
        </label>
        <label className="add-game-form__label">
          Описание
          <textarea
            className="add-game-form__textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
            aria-required="true"
          />
        </label>
        <label className="add-game-form__label">
          Форма игры
          <select
            className="add-game-form__select"
            value={gameFormat}
            onChange={(e) => setGameFormat(e.target.value)}
            aria-label="Форма игры"
          >
            {GAME_FORMATS.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </label>
        <label className="add-game-form__label">
          Файл игры (ZIP-архив)
          <input
            type="file"
            className="add-game-form__file"
            accept=".zip"
            onChange={(e) => setArchiveFile(e.target.files?.[0] ?? null)}
            aria-label="Выберите ZIP-архив"
          />
          {archiveFile && (
            <span className="add-game-form__file-name">{archiveFile.name}</span>
          )}
        </label>
        <label className="add-game-form__label">
          Категория
          <select
            className="add-game-form__select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            aria-label="Категория игры"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <fieldset className="add-game-form__accessibility" aria-label="Доступность игры">
          <legend>Чек-лист доступности</legend>
          <label className="add-game-form__checkbox">
            <input
              type="checkbox"
              checked={keyboard}
              onChange={(e) => setKeyboard(e.target.checked)}
              aria-label="Управление с клавиатуры"
            />
            Управление с клавиатуры
          </label>
          <label className="add-game-form__checkbox">
            <input
              type="checkbox"
              checked={sound}
              onChange={(e) => setSound(e.target.checked)}
              aria-label="Озвучка"
            />
            Озвучка
          </label>
          <label className="add-game-form__checkbox">
            <input
              type="checkbox"
              checked={screenReader}
              onChange={(e) => setScreenReader(e.target.checked)}
              aria-label="Работа со скринридером"
            />
            Работа со скринридером
          </label>
        </fieldset>
        <fieldset className="add-game-form__platforms" aria-label="Платформы">
          <legend>Платформы</legend>
          <label className="add-game-form__checkbox">
            <input
              type="checkbox"
              checked={platformMobile}
              onChange={(e) => setPlatformMobile(e.target.checked)}
              aria-label="Мобильная"
            />
            Мобильная
          </label>
          <label className="add-game-form__checkbox">
            <input
              type="checkbox"
              checked={platformDesktop}
              onChange={(e) => setPlatformDesktop(e.target.checked)}
              aria-label="Компьютер"
            />
            Компьютер
          </label>
        </fieldset>
        <button type="submit" className="add-game-form__submit">
          Отправить на модерацию
        </button>
      </form>
      <p><Link to="/my-games">В мой кабинет</Link></p>
    </>
  )
}

export default AddGame
