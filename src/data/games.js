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

const STORAGE_KEY = 'megaschool_games'
const defaultGames = [
  {
    id: '2',
    title: 'Слова на время',
    description: 'Набирайте слова на время.',
    playUrl: '/games/slova-na-vremya/index.html',
    authorName: 'Автор 2',
    authorId: 'author2',
    categoryId: 'words',
    status: GAME_STATUS.PUBLISHED,
    publishedAt: '2026-01-15',
    views: 0,
    launches: 0,
    accessibility: { keyboard: true, sound: true, screenReader: true },
    ratings: [],
    comments: [],
  },
  {
    id: '3',
    title: 'Найди пары',
    description: 'Открывайте карточки и находите одинаковые символы. Тренируйте память и внимание.',
    playUrl: '/games/pamjat/index.html',
    authorName: 'Автор N',
    authorId: 'megaschool',
    categoryId: 'memory',
    status: GAME_STATUS.PUBLISHED,
    publishedAt: '2026-01-30',
    views: 0,
    launches: 0,
    accessibility: { keyboard: false, sound: false, screenReader: true },
    ratings: [],
    comments: [],
  },
  {
    id: '5',
    title: 'Быстрый счет',
    description: 'Решайте примеры на время. Сложение, вычитание, умножение и деление.',
    playUrl: '/games/bystryj-schet/index.html',
    authorName: 'Автор X',
    authorId: 'megaschool',
    categoryId: 'logic',
    status: GAME_STATUS.PUBLISHED,
    publishedAt: '2026-01-20',
    views: 0,
    launches: 0,
    accessibility: { keyboard: true, sound: false, screenReader: true },
    ratings: [],
    comments: [],
  },
]

let nextId = 6
let nextCommentId = 1
const gamesList = [...defaultGames]

function loadGames() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const data = JSON.parse(raw)
    if (!data || !Array.isArray(data.games)) return
    const maxId = data.games.reduce((m, g) => Math.max(m, Number(g.id) || 0), 0)
    const maxC = data.games.reduce((m, g) => {
      const arr = g.comments ?? []
      return arr.reduce((mc, c) => Math.max(mc, Number(c.id) || 0), m)
    }, 0)
    gamesList.length = 0
    gamesList.push(...data.games.filter((g) => g.id !== '1' && g.id !== '4'))
    gamesList.forEach((g) => {
      if (g.id === '2' && (g.playUrl || '').includes('example.com')) g.playUrl = '/games/slova-na-vremya/index.html'
    })
    defaultGames.forEach((dg) => {
      if (dg.id >= '3' && !gamesList.some((g) => g.id === dg.id)) gamesList.push({ ...dg })
    })
    const mergedMaxId = gamesList.reduce((m, g) => Math.max(m, Number(g.id) || 0), 0)
    nextId = Math.max(Number(data.nextId) || 3, mergedMaxId + 1, 6)
    nextCommentId = (Number(data.nextCommentId) > maxC ? Number(data.nextCommentId) : maxC + 1) || 1
  } catch {}
}

function saveGames() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      games: gamesList,
      nextId,
      nextCommentId,
    }))
  } catch {}
}

loadGames()

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
  saveGames()
  return game
}

export function approveGame(id) {
  const g = gamesList.find((x) => x.id === id)
  if (!g || g.status !== GAME_STATUS.ON_MODERATION) return null
  g.status = GAME_STATUS.PUBLISHED
  g.publishedAt = new Date().toISOString().slice(0, 10)
  g.rejectReason = null
  saveGames()
  return g
}

export function rejectGame(id, reason) {
  const g = gamesList.find((x) => x.id === id)
  if (!g || g.status !== GAME_STATUS.ON_MODERATION) return null
  g.status = GAME_STATUS.REJECTED
  g.rejectReason = reason ?? ''
  saveGames()
  return g
}

export function recordView(gameId) {
  const g = gamesList.find((x) => x.id === gameId)
  if (g) {
    g.views = (g.views ?? 0) + 1
    saveGames()
  }
}

export function recordLaunch(gameId) {
  const g = gamesList.find((x) => x.id === gameId)
  if (g) {
    g.launches = (g.launches ?? 0) + 1
    saveGames()
  }
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
  saveGames()
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
  saveGames()
  return g
}

export function getComments(gameId) {
  const g = gamesList.find((x) => x.id === gameId)
  return g?.comments ?? []
}
