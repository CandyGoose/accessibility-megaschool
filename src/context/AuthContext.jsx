import { createContext, useContext, useState } from 'react'

const ROLES = {
  GUEST: 'guest',
  AUTHOR: 'author',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  function login(credentials) {
    const role = credentials.role ?? ROLES.AUTHOR
    setUser({
      id: String(Date.now()),
      name: credentials.name || 'Пользователь',
      email: credentials.email || '',
      role,
    })
  }

  function logout() {
    setUser(null)
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
