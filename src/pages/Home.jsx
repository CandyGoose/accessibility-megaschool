import { Link } from 'react-router-dom'

function Home() {
  return (
    <>
      <h1>О проекте</h1>
      <p>
        Сайт онлайн-игр для незрячих и слабовидящих. Игры управляются с клавиатуры,
        озвучиваются и подходят для использования со скринридером.
      </p>
      <p>
        <Link to="/games">Перейти в каталог игр</Link>
      </p>
    </>
  )
}

export default Home
