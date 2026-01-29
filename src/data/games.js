export const GAME_STATUS = {
  PUBLISHED: 'published',
  ON_MODERATION: 'on_moderation',
  REJECTED: 'rejected',
  DRAFT: 'draft',
}

let nextId = 3
const gamesList = [
  {
    id: '1',
    title: 'Угадай звук',
    description: 'Игра на распознавание звуков.',
    playUrl: 'https://example.com/game1',
    authorName: 'Автор 1',
    authorId: 'author1',
    status: GAME_STATUS.PUBLISHED,
    publishedAt: '2026-01-15',
  },
  {
    id: '2',
    title: 'Слова на время',
    description: 'Набирайте слова с клавиатуры на время.',
    playUrl: 'https://example.com/game2',
    authorName: 'Автор 2',
    authorId: 'author2',
    status: GAME_STATUS.PUBLISHED,
    publishedAt: '2026-01-20',
  },
]

export const games = gamesList

export function getGameById(id) {
  return gamesList.find((g) => g.id === id) ?? null
}

export function getPublishedGames() {
  return gamesList.filter((g) => g.status === GAME_STATUS.PUBLISHED)
}

export function getGamesByAuthor(authorId) {
  return gamesList.filter((g) => g.authorId === authorId)
}

export function getGamesOnModeration() {
  return gamesList.filter((g) => g.status === GAME_STATUS.ON_MODERATION)
}

export function addGame(data) {
  const game = {
    id: String(nextId++),
    title: data.title,
    description: data.description,
    playUrl: data.playUrl,
    authorName: data.authorName,
    authorId: data.authorId,
    status: GAME_STATUS.ON_MODERATION,
    publishedAt: null,
    rejectReason: null,
  }
  gamesList.push(game)
  return game
}

export function approveGame(id) {
  const g = gamesList.find((x) => x.id === id)
  if (!g || g.status !== GAME_STATUS.ON_MODERATION) return null
  g.status = GAME_STATUS.PUBLISHED
  g.publishedAt = new Date().toISOString().slice(0, 10)
  g.rejectReason = null
  return g
}

export function rejectGame(id, reason) {
  const g = gamesList.find((x) => x.id === id)
  if (!g || g.status !== GAME_STATUS.ON_MODERATION) return null
  g.status = GAME_STATUS.REJECTED
  g.rejectReason = reason ?? ''
  return g
}
