import { createContext, useContext, useState } from 'react'

const ROLES = {
  GUEST: 'guest',
  AUTHOR: 'author',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
}

const STORAGE_KEY = 'megaschool_user'

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (data && typeof data.id === 'string' && data.role) return data
    return null
  } catch {
    return null
  }
}

function saveUser(data) {
  if (data) localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  else localStorage.removeItem(STORAGE_KEY)
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadUser())

  function login(credentials) {
    const role = credentials.role ?? ROLES.AUTHOR
    const data = {
      id: String(Date.now()),
      name: credentials.name || 'Пользователь',
      email: credentials.email || '',
      role,
    }
    setUser(data)
    saveUser(data)
  }

  function logout() {
    setUser(null)
    saveUser(null)
  }

  const value = {
    user,
    login,
    logout,
    isAuthor: user?.role === ROLES.AUTHOR || user?.role === ROLES.ADMIN,
    isModerator: user?.role === ROLES.MODERATOR || user?.role === ROLES.ADMIN,
    isAdmin: user?.role === ROLES.ADMIN,
    ROLES,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth used outside AuthProvider')
  return ctx
}
