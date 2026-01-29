export const GAME_STATUS = {
  PUBLISHED: 'published',
  ON_MODERATION: 'on_moderation',
  REJECTED: 'rejected',
  DRAFT: 'draft',
}

export const CATEGORIES = [
  { id: 'sound', name: 'Звук и музыка' },
  { id: 'words', name: 'Слова и текст' },
  { id: 'memory', name: 'Память и внимание' },
  { id: 'logic', name: 'Логика' },
  { id: 'other', name: 'Другое' },
]

let nextId = 3
let nextCommentId = 1
const gamesList = [
  {
    id: '1',
    title: 'Угадай звук',
    description: 'Игра на распознавание звуков.',
    playUrl: 'https://example.com/game1',
    authorName: 'Автор 1',
    authorId: 'author1',
    categoryId: 'sound',
    status: GAME_STATUS.PUBLISHED,
    publishedAt: '2026-01-15',
    views: 0,
    launches: 0,
    accessibility: { keyboard: true, sound: true, screenReader: true },
    ratings: [],
    comments: [],
  },
  {
    id: '2',
    title: 'Слова на время',
    description: 'Набирайте слова с клавиатуры на время.',
    playUrl: 'https://example.com/game2',
    authorName: 'Автор 2',
    authorId: 'author2',
    categoryId: 'words',
    status: GAME_STATUS.PUBLISHED,
    publishedAt: '2026-01-20',
    views: 0,
    launches: 0,
    accessibility: { keyboard: true, sound: true, screenReader: true },
    ratings: [],
    comments: [],
  },
]

export const games = gamesList

export function getCategories() {
  return CATEGORIES
}

export function getCategoryById(id) {
  return CATEGORIES.find((c) => c.id === id) ?? null
}

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
    categoryId: data.categoryId ?? 'other',
    status: GAME_STATUS.ON_MODERATION,
    publishedAt: null,
    rejectReason: null,
    views: 0,
    launches: 0,
    accessibility: data.accessibility ?? { keyboard: false, sound: false, screenReader: false },
    ratings: [],
    comments: [],
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

export function recordView(gameId) {
  const g = gamesList.find((x) => x.id === gameId)
  if (g) g.views = (g.views ?? 0) + 1
}

export function recordLaunch(gameId) {
  const g = gamesList.find((x) => x.id === gameId)
  if (g) g.launches = (g.launches ?? 0) + 1
}

export function addRating(gameId, userId, userName, value) {
  const g = gamesList.find((x) => x.id === gameId)
  if (!g) return null
  const existing = g.ratings.find((r) => r.userId === userId)
  if (existing) {
    existing.value = value
  } else {
    g.ratings.push({ userId, userName, value })
  }
  return g
}

export function getAverageRating(game) {
  const list = game?.ratings ?? []
  if (list.length === 0) return null
  const sum = list.reduce((s, r) => s + r.value, 0)
  return Math.round((sum / list.length) * 10) / 10
}

export function addComment(gameId, userId, userName, text) {
  const g = gamesList.find((x) => x.id === gameId)
  if (!g) return null
  g.comments = g.comments ?? []
  g.comments.push({
    id: String(nextCommentId++),
    userId,
    userName: userName || 'Гость',
    text: text.trim(),
    date: new Date().toISOString(),
  })
  return g
}

export function getComments(gameId) {
  const g = gamesList.find((x) => x.id === gameId)
  return g?.comments ?? []
}
