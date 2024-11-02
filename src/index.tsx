import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import GameSection from './components/GameSection.tsx'
import Game from './games/quiz/main.tsx'
import GlobalStyle from './GlobalStyle.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameSection>
      <GlobalStyle />
      <Game />
    </GameSection>
  </StrictMode>,
)
