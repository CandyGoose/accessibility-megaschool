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
  const [errors, setErrors] = useState({ name: '', email: '' })

  function handleSubmit(e) {
    e.preventDefault()
    const nameTrimmed = name.trim()
    const emailTrimmed = email.trim()
    const newErrors = {}

    if (!nameTrimmed) {
      newErrors.name = 'Введите имя'
    }
    if (!emailTrimmed) {
      newErrors.email = 'Введите email'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({ name: '', email: '' })
    login({ name: nameTrimmed, email: emailTrimmed, role })
    navigate('/')
  }

  function clearError(field) {
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  return (
    <>
      <h1 className="login-title">Вход</h1>
      <form className="login-form" onSubmit={handleSubmit} aria-label="Форма входа" noValidate>
        <label className="login-form__label">
          Имя <span className="login-form__required" aria-hidden="true">*</span>
          <input
            type="text"
            className={`login-form__input ${errors.name ? 'login-form__input_error' : ''}`}
            value={name}
            onChange={(e) => { setName(e.target.value); clearError('name') }}
            onBlur={() => name.trim() && clearError('name')}
            autoComplete="name"
            required
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'login-name-error' : undefined}
          />
          {errors.name && (
            <span id="login-name-error" className="login-form__error" role="alert">
              {errors.name}
            </span>
          )}
        </label>
        <label className="login-form__label">
          Email <span className="login-form__required" aria-hidden="true">*</span>
          <input
            type="email"
            className={`login-form__input ${errors.email ? 'login-form__input_error' : ''}`}
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearError('email') }}
            onBlur={() => email.trim() && clearError('email')}
            autoComplete="email"
            required
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
          />
          {errors.email && (
            <span id="login-email-error" className="login-form__error" role="alert">
              {errors.email}
            </span>
          )}
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
          </select>
        </label>
        <button type="submit" className="login-form__submit">
          Войти
        </button>
      </form>
      <p className="login-back">
        <Link to="/">На главную</Link>
      </p>
    </>
  )
}

export default Login
