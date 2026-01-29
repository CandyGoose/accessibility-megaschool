import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { addGame, getCategories } from '../data/games'
import './AddGame.css'

function AddGame() {
  const navigate = useNavigate()
  const { user, isAuthor } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [playUrl, setPlayUrl] = useState('')
  const [categoryId, setCategoryId] = useState('other')
  const [keyboard, setKeyboard] = useState(false)
  const [sound, setSound] = useState(false)
  const [screenReader, setScreenReader] = useState(false)
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
      playUrl: playUrl.trim(),
      authorName: user.name,
      authorId: user.id,
      categoryId: categoryId || 'other',
      accessibility: { keyboard, sound, screenReader },
    })
    navigate('/my-games')
  }

  return (
    <>
      <h1>Добавить игру</h1>
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
          Ссылка на игру
          <input
            type="url"
            className="add-game-form__input"
            value={playUrl}
            onChange={(e) => setPlayUrl(e.target.value)}
            required
            aria-required="true"
            placeholder="https://..."
          />
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
        <button type="submit" className="add-game-form__submit">
          Отправить на модерацию
        </button>
      </form>
      <p><Link to="/my-games">В мой кабинет</Link></p>
    </>
  )
}

export default AddGame
