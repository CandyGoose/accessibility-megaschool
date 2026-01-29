import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Layout.css'

function Layout() {
  const { user, logout, isAuthor, isModerator } = useAuth()
  return (
    <div className="app">
      <Link to="/#main" className="skip-link">
        Перейти к основному содержимому
      </Link>
      <header className="header" role="banner">
        <div className="header__inner">
          <h1 className="logo">
            <Link to="/">Игры для слабовидящих</Link>
          </h1>
          <nav className="nav" aria-label="Главное меню">
            <ul className="nav__list">
              <li><Link to="/" className="nav__link">Главная</Link></li>
              <li><Link to="/games" className="nav__link">Игры</Link></li>
              {isAuthor && (
                <>
                  <li><Link to="/add-game" className="nav__link">Добавить игру</Link></li>
                  <li><Link to="/my-games" className="nav__link">Мой кабинет</Link></li>
                </>
              )}
              {isModerator && (
                <li><Link to="/moderation" className="nav__link">Модерация</Link></li>
              )}
              {user ? (
                <>
                  <li><span className="nav__user" aria-label={`Пользователь: ${user.name}`}>{user.name}</span></li>
                  <li><button type="button" className="nav__logout" onClick={logout}>Выйти</button></li>
                </>
              ) : (
                <li><Link to="/login" className="nav__link">Войти</Link></li>
              )}
            </ul>
          </nav>
        </div>
      </header>
      <main id="main" className="main" role="main">
        <div className="main__inner">
          <Outlet />
        </div>
      </main>
      <footer className="footer" role="contentinfo">
        <div className="footer__inner">
          <p>Игры для слабовидящих</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
