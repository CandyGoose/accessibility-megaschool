import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { addGame } from '../data/games'
import './AddGame.css'

function AddGame() {
  const navigate = useNavigate()
  const { user, isAuthor } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [playUrl, setPlayUrl] = useState('')

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
        <button type="submit" className="add-game-form__submit">
          Отправить на модерацию
        </button>
      </form>
      <p><Link to="/my-games">В мой кабинет</Link></p>
    </>
  )
}

export default AddGame
