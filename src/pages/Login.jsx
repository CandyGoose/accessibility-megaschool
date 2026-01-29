import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('author')

  function handleSubmit(e) {
    e.preventDefault()
    login({ name: name || 'Пользователь', email, role })
    navigate('/')
  }

  return (
    <>
      <h1>Вход</h1>
      <form className="login-form" onSubmit={handleSubmit} aria-label="Форма входа">
        <label className="login-form__label">
          Имя
          <input
            type="text"
            className="login-form__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            aria-describedby="login-name-hint"
          />
        </label>
        <span id="login-name-hint" className="visually-hidden">Можно оставить пустым</span>
        <label className="login-form__label">
          Email
          <input
            type="email"
            className="login-form__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>
        <label className="login-form__label">
          Роль (для теста)
          <select
            className="login-form__select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            aria-label="Выбор роли"
          >
            <option value="author">Автор</option>
            <option value="moderator">Модератор</option>
            <option value="admin">Админ</option>
          </select>
        </label>
        <button type="submit" className="login-form__submit">
          Войти
        </button>
      </form>
      <p>
        <Link to="/">На главную</Link>
      </p>
    </>
  )
}

export default Login
