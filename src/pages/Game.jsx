import { useParams, Link } from 'react-router-dom'
import { getGameById } from '../data/games'
import { GAME_STATUS } from '../data/games'
import './Game.css'

function Game() {
  const { id } = useParams()
  const game = getGameById(id)
  if (!game) {
    return (
      <>
        <h1>Игра не найдена</h1>
        <p><Link to="/games">Вернуться в каталог</Link></p>
      </>
    )
  }
  return (
    <>
      <nav aria-label="Хлебные крошки">
        <Link to="/games">Каталог</Link>
        <span className="breadcrumb-sep"> / </span>
        <span>{game.title}</span>
      </nav>
      <h1>{game.title}</h1>
      <p>{game.description}</p>
      <p className="game-meta">Автор: {game.authorName}</p>
      {game.status === GAME_STATUS.PUBLISHED ? (
        <a
          href={game.playUrl}
          className="game-play-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Играть
        </a>
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
