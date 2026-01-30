import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  getGameById,
  GAME_STATUS,
  recordView,
  recordLaunch,
  getAverageRating,
  addRating,
  addComment,
  getComments,
  getCategoryById,
} from '../data/games'
import './Game.css'

function Game() {
  const { id } = useParams()
  const { user } = useAuth()
  const game = getGameById(id)
  const [ratingValue, setRatingValue] = useState('')
  const [commentText, setCommentText] = useState('')
  const [commentName, setCommentName] = useState(user?.name ?? '')
  const [refresh, setRefresh] = useState(0)
  const [showGameFrame, setShowGameFrame] = useState(false)
  const fullscreenRef = useRef(null)

  useEffect(() => {
    if (game?.id) recordView(game.id)
  }, [game?.id])

  useEffect(() => {
    if (!showGameFrame || !fullscreenRef.current) return
    const el = fullscreenRef.current
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) setShowGameFrame(false)
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    const req = el.requestFullscreen?.() ?? el.webkitRequestFullscreen?.()
    if (req?.then) req.catch(() => {})
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [showGameFrame])

  useEffect(() => {
    if (!showGameFrame) return
    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return
      if (document.fullscreenElement) {
        document.exitFullscreen?.() ?? document.webkitExitFullscreen?.()
      } else {
        setShowGameFrame(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [showGameFrame])

  if (!game) {
    return (
      <>
        <h1>Игра не найдена</h1>
        <p><Link to="/games">Вернуться в каталог</Link></p>
      </>
    )
  }

  const avgRating = getAverageRating(game)
  const comments = getComments(game.id)
  const category = getCategoryById(game.categoryId)

  function handlePlayClick() {
    setShowGameFrame(true)
    recordLaunch(game.id)
  }

  function handleRatingSubmit(e) {
    e.preventDefault()
    const value = Number(ratingValue)
    if (value >= 1 && value <= 5) {
      addRating(game.id, user?.id ?? 'guest', (user?.name ?? commentName) || 'Гость', value)
      setRatingValue('')
      setRefresh((r) => r + 1)
    }
  }

  function handleCommentSubmit(e) {
    e.preventDefault()
    if (!commentText.trim()) return
    addComment(game.id, user?.id ?? 'guest', (user?.name ?? commentName) || 'Гость', commentText)
    setCommentText('')
    setRefresh((r) => r + 1)
  }

  return (
    <>
      <nav aria-label="Хлебные крошки">
        <Link to="/games">Каталог</Link>
        <span className="breadcrumb-sep" aria-hidden="true"> / </span>
        <span aria-current="page">{game.title}</span>
      </nav>
      <h1>{game.title}</h1>
      <p>{game.description}</p>
      <p className="game-meta">
        Автор: {game.authorName}
        {category && `, категория: ${category.name}`}
      </p>
      {avgRating !== null && (
        <p className="game-rating" aria-label={`Рейтинг: ${avgRating} из 5`}>
          Рейтинг: {avgRating} из 5
        </p>
      )}
      {game.status === GAME_STATUS.PUBLISHED ? (
        <>
          <div className="game-play-area">
            {!game.playUrl ? (
              <p className="game-no-play">
                Игра загружена в формате {game.gameFormat === 'unity' ? 'Unity' : 'HTML'}
                {game.archiveFileName && ` (файл: ${game.archiveFileName})`}. Пока недоступна для запуска.
              </p>
            ) : !showGameFrame ? (
              <button
                type="button"
                className="game-play-btn"
                onClick={handlePlayClick}
                aria-label={`Запустить игру: ${game.title}`}
              >
                Играть
              </button>
            ) : (
              <div ref={fullscreenRef} className="game-frame-wrap">
                <p className="game-frame-exit-hint" aria-live="polite">
                  Escape - выход из игры
                </p>
                <iframe
                  src={game.playUrl}
                  title={game.title}
                  className="game-frame"
                  allow="fullscreen; gamepad"
                />
              </div>
            )}
          </div>
          <section className="game-rating-section" aria-label="Оценить игру">
            <h2>Оценить игру</h2>
            <form onSubmit={handleRatingSubmit} className="game-rating-form">
              <label className="game-rating-form__label">
                Оценка (1-5)
                <select
                  value={ratingValue}
                  onChange={(e) => setRatingValue(e.target.value)}
                  required
                  aria-required="true"
                  className="game-rating-form__select"
                >
                  <option value="">Выберите</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </label>
              <button type="submit" className="game-rating-form__btn">Отправить оценку</button>
            </form>
          </section>
          <section className="game-comments" aria-label="Комментарии">
            <h2>Комментарии</h2>
            <form onSubmit={handleCommentSubmit} className="game-comment-form">
              {!user && (
                <label className="game-comment-form__label">
                  Ваше имя
                  <input
                    type="text"
                    className="game-comment-form__input"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    placeholder="Гость"
                  />
                </label>
              )}
              <label className="game-comment-form__label">
                Текст комментария
                <textarea
                  className="game-comment-form__textarea"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={3}
                  required
                  aria-required="true"
                />
              </label>
              <button type="submit" className="game-comment-form__btn">Добавить комментарий</button>
            </form>
            <ul className="game-comments-list" aria-label="Список комментариев">
              {comments.map((c) => (
                <li key={c.id} className="game-comments-list__item">
                  <p className="game-comments-list__author">{c.userName}</p>
                  <p className="game-comments-list__text">{c.text}</p>
                  <p className="game-comments-list__date">
                    {new Date(c.date).toLocaleDateString('ru')}
                  </p>
                </li>
              ))}
            </ul>
            {comments.length === 0 && <p className="game-comments-empty">Пока нет комментариев.</p>}
          </section>
        </>
      ) : (
        <p className="game-status-msg">
          {game.status === GAME_STATUS.ON_MODERATION && 'Игра на модерации.'}
          {game.status === GAME_STATUS.REJECTED && game.rejectReason && `Игра отклонена. Причина: ${game.rejectReason}`}
          {game.status === GAME_STATUS.REJECTED && !game.rejectReason && 'Игра отклонена.'}
        </p>
      )}
    </>
  )
}

export default Game
