import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }
  @font-face {
  font-family: Nikumaru;
  src: url("assets/fonts/nikumaru.otf");
}
`
export default GlobalStyle
