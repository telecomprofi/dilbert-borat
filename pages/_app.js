import '../styles/globals.css';
import { createGlobalStyle } from 'styled-components';
import { ServerStyleSheet } from 'styled-components';
import { useEffect, useState } from 'react';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    padding: 0;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    background-color: #f5f5f5;
  }

  * {
    box-sizing: border-box;
  }

  button {
    all: unset;
    cursor: pointer;
  }

  button:focus {
    outline: none;
  }
`;

function MyApp({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <GlobalStyle />
      {mounted ? <Component {...pageProps} /> : null}
    </>
  );
}

export default MyApp;
