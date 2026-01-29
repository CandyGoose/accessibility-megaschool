import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getGamesOnModeration, approveGame, rejectGame, getCategoryById } from '../data/games'
import './Moderation.css'

function Moderation() {
  const { user, isModerator } = useAuth()
  const [rejectReasons, setRejectReasons] = useState({})
  const list = isModerator ? getGamesOnModeration() : []

  if (!user || !isModerator) {
    return (
      <>
        <h1>Модерация</h1>
        <p>Доступ только для модераторов.</p>
        <p><Link to="/login">Войти</Link></p>
      </>
    )
  }

  function handleApprove(id) {
    approveGame(id)
    setRejectReasons((prev) => ({ ...prev, [id]: '' }))
  }

  function handleReject(id) {
    const reason = rejectReasons[id] ?? ''
    rejectGame(id, reason)
    setRejectReasons((prev) => ({ ...prev, [id]: '' }))
  }

  return (
    <>
      <h1>Очередь на модерацию</h1>
      {list.length === 0 ? (
        <p>Нет игр на модерации.</p>
      ) : (
        <ul className="moderation-list" aria-label="Игры на модерации">
          {list.map((game) => {
            const cat = getCategoryById(game.categoryId)
            const acc = game.accessibility ?? {}
            return (
              <li key={game.id} className="moderation-list__item">
                <h2 className="moderation-list__title">
                  <Link to={`/games/${game.id}`}>{game.title}</Link>
                </h2>
                <p className="moderation-list__desc">{game.description}</p>
                <p className="moderation-list__meta">
                  Автор: {game.authorName}
                  {cat && `, категория: ${cat.name}`}
                </p>
                <div className="moderation-list__accessibility" role="group" aria-label="Чек-лист доступности от автора">
                  <p className="moderation-list__accessibility-title">Доступность (заявил автор):</p>
                  <ul className="moderation-list__accessibility-list">
                    <li className={acc.keyboard ? 'moderation-list__acc--yes' : 'moderation-list__acc--no'}>
                      Управление с клавиатуры: {acc.keyboard ? 'да' : 'нет'}
                    </li>
                    <li className={acc.sound ? 'moderation-list__acc--yes' : 'moderation-list__acc--no'}>
                      Озвучка: {acc.sound ? 'да' : 'нет'}
                    </li>
                    <li className={acc.screenReader ? 'moderation-list__acc--yes' : 'moderation-list__acc--no'}>
                      Работа со скринридером: {acc.screenReader ? 'да' : 'нет'}
                    </li>
                  </ul>
                </div>
                <div className="moderation-list__actions">
                  <label className="moderation-list__reason-label">
                    Причина отклонения (если отклонить):
                    <input
                      type="text"
                      className="moderation-list__reason-input"
                      value={rejectReasons[game.id] ?? ''}
                      onChange={(e) => setRejectReasons((prev) => ({ ...prev, [game.id]: e.target.value }))}
                      placeholder="Необязательно"
                      aria-label="Причина отклонения"
                    />
                  </label>
                  <div className="moderation-list__buttons">
                    <button
                      type="button"
                      className="moderation-list__btn moderation-list__btn--approve"
                      onClick={() => handleApprove(game.id)}
                    >
                      Одобрить
                    </button>
                    <button
                      type="button"
                      className="moderation-list__btn moderation-list__btn--reject"
                      onClick={() => handleReject(game.id)}
                    >
                      Отклонить
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}

export default Moderation
