import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getGamesByAuthor } from '../data/games'
import { GAME_STATUS } from '../data/games'
import './MyGames.css'

function statusLabel(status) {
  switch (status) {
    case GAME_STATUS.PUBLISHED:
      return 'Опубликовано'
    case GAME_STATUS.ON_MODERATION:
      return 'На модерации'
    case GAME_STATUS.REJECTED:
      return 'Отклонено'
    case GAME_STATUS.DRAFT:
      return 'Черновик'
    default:
      return status
  }
}

function MyGames() {
  const { user, isAuthor } = useAuth()
  if (!user || !isAuthor) {
    return (
      <>
        <h1>Мой кабинет</h1>
        <p>Войдите как автор, чтобы видеть свои игры.</p>
        <p><Link to="/login">Войти</Link></p>
      </>
    )
  }
  const list = getGamesByAuthor(user.id)
  return (
    <>
      <h1>Мои игры</h1>
      <p><Link to="/add-game">Добавить игру</Link></p>
      {list.length === 0 ? (
        <p>У вас пока нет игр.</p>
      ) : (
        <ul className="my-games-list" aria-label="Список моих игр">
          {list.map((game) => (
            <li key={game.id} className="my-games-list__item">
              <h2 className="my-games-list__title">
                <Link to={`/games/${game.id}`}>{game.title}</Link>
              </h2>
              <p className="my-games-list__status">
                Статус: <span className={`my-games-list__status-badge my-games-list__status-badge--${game.status}`}>{statusLabel(game.status)}</span>
              </p>
              {game.status === GAME_STATUS.PUBLISHED && (
                <p className="my-games-list__stats">
                  Просмотры: {game.views ?? 0}, запуски: {game.launches ?? 0}
                </p>
              )}
              {game.rejectReason && (
                <p className="my-games-list__reject">Причина отклонения: {game.rejectReason}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default MyGames
