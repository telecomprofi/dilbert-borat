import { useState, useEffect } from 'react';
import Head from 'next/head';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  z-index: 1;
  background-color: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 0;
`;

const NewJokeDisplay = styled.div`
  font-size: 125%;
  margin: 20px 0 0 0;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 5px;
  text-align: center;
  font-weight: 500;
`;

const Copyright = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin: 0;
  text-align: center;
`;

const JokeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  justify-content: center;
  position: relative;
  z-index: 2;
`;

const ActionButton = styled.button`
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  background-color: #1DA1F2;
  color: white;
  border: none;
  border-radius: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;

  &:hover {
    background-color: #1a8cd8;
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const ComicButton = styled(ActionButton)`
  background-color: #0070f3;

  &:hover {
    background-color: #0051a2;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  margin: 1rem 0;
  padding: 0.5rem;
  border: 1px solid #dc3545;
  border-radius: 4px;
  background-color: #fff;
`;

const DilbertContainer = styled.div`
  margin-top: 2rem;
  text-align: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18.75%;
  margin: -18.75% 0;
  position: relative;
  border-radius: 0;
`;

const DilbertImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  width: 66.67%;
  transform: scale(1.5);
  transform-origin: center;
  margin: 0 auto;
  position: relative;
`;

const ComicLabels = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  position: relative;
  z-index: 2;
  background-color: white;
  padding: 1rem;
`;

const ComicYear = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin: 0;
`;

export default function Home() {
  const [joke, setJoke] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dilbertUrl, setDilbertUrl] = useState('');
  const [comicYear, setComicYear] = useState('');
  const [comicFilename, setComicFilename] = useState('');

  const loadInitialJoke = async () => {
    try {
      const response = await fetch('/api/jokes');
      if (!response.ok) throw new Error('Failed to fetch joke');
      const data = await response.json();
      setJoke(data.content);
    } catch (error) {
      setError('Failed to load initial joke');
    }
  };

  useEffect(() => {
    loadInitialJoke();
  }, []);

  const handleButtonClick = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/jokes', {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to fetch joke');
      const data = await response.json();
      setJoke(data.content);
    } catch (error) {
      setError('Failed to fetch joke');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshDilbert = async () => {
    setError('');
    try {
      const response = await fetch('/api/dilbert');
      if (!response.ok) throw new Error('Failed to fetch Dilbert comic');
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setDilbertUrl(imageUrl);
      const year = response.headers.get('X-Image-Year');
      setComicYear(year);
      const filename = response.headers.get('X-Image-Filename');
      if (filename) {
        const cleanFilename = filename.replace(/\.(jpg|jpeg|png|gif)$/i, '').replace(/[-_]/g, ' ');
        setComicFilename(cleanFilename);
      } else {
        setComicFilename('');
      }
    } catch (error) {
      setError('Failed to fetch Dilbert comic');
    }
  };

  useEffect(() => {
    refreshDilbert();
  }, []);

  return (
    <Container>
      <Head>
        <title>NextJS Docker demo app</title>
        <meta name="description" content="Get your daily dose of DevOps humor" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#1DA1F2" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="NextJS Docker demo app" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </Head>

      <ButtonContainer>
        <ActionButton onClick={handleButtonClick} disabled={isLoading}>
          Get New Joke
        </ActionButton>
        <ComicButton onClick={refreshDilbert} disabled={isLoading}>
          New Comic
        </ComicButton>
      </ButtonContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {joke && (
        <JokeContainer>
          <NewJokeDisplay>{joke}</NewJokeDisplay>
          <Copyright>Copyright @DEVOPS_BORAT / X</Copyright>
        </JokeContainer>
      )}

      <DilbertContainer>
        {dilbertUrl && (
          <DilbertImage
            src={dilbertUrl}
            alt="Dilbert Comic"
            onError={() => setError('Failed to load Dilbert comic')}
          />
        )}
      </DilbertContainer>
      
      {dilbertUrl && (
        <ComicLabels>
          {comicYear && <ComicYear>Dilbert from {comicYear}{comicFilename && ` - ${comicFilename}`}</ComicYear>}
          <Copyright>© Copyright by Scott Adams</Copyright>
        </ComicLabels>
      )}
    </Container>
  );
}
