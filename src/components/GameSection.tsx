import styled from 'styled-components'

const GameSection = styled.section`
  #phaser-game {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  canvas {
    max-height: 720px;
    max-width: 720px;
    object-fit: contain;
    margin: 0 auto;
  }

  @media (max-height: 720px) {
    max-height: 400px;
    max-width: 400px;
    margin: 0 auto;
  }
`

export default GameSection
