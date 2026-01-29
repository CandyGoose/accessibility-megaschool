import './App.css'

function App() {
  return (
    <div className="app">
      <a href="#main" className="skip-link">
        Перейти к основному содержимому
      </a>

      <header className="header" role="banner">
        <div className="header__inner">
          <h1 className="logo">
            <a href="/">Игры для слабовидящих</a>
          </h1>
          <nav className="nav" aria-label="Главное меню">
            <ul className="nav__list">
              <li><a href="#main" className="nav__link">Главная</a></li>
              <li><a href="#games" className="nav__link">Игры</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="main" className="main" role="main">
        <div className="main__inner">
          <h2>О проекте</h2>
          <p>
            Сайт онлайн-игр для незрячих и слабовидящих. Игры управляются с клавиатуры,
            озвучиваются и подходят для использования со скринридером.
          </p>

          <h2 id="games">Игры</h2>
          <p>Список игр появится здесь.</p>
          <ul className="games-list" aria-label="Список игр">
            <li className="games-list__item">
              <h3>Заготовка игры 1</h3>
              <p>Описание будет добавлено позже.</p>
            </li>
            <li className="games-list__item">
              <h3>Заготовка игры 2</h3>
              <p>Описание будет добавлено позже.</p>
            </li>
          </ul>
        </div>
      </main>

      <footer className="footer" role="contentinfo">
        <div className="footer__inner">
          <p>Игры для слабовидящих 2026</p>
        </div>
      </footer>
    </div>
  )
}

export default App
