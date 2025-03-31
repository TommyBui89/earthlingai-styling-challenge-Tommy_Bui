import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faForward, faBackward, faSearch, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';

import logo from './earthlingai_logo.png'

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const wave = keyframes`
  0% { transform: scaleY(1); }
  50% { transform: scaleY(0.3); }
  100% { transform: scaleY(1); }
`;

const DJPlayer = () => {
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentBackground, setCurrentBackground] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const audioRef = useRef(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch('https://earthlingai.app/download/projects.json');
        if (!response.ok) {
          throw new Error('Failed to fetch tracks');
        }
        const data = await response.json();
        console.log('First track data:', data[0]);
        setTracks(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchTracks();
  }, []);

  useEffect(() => {
    if (tracks.length > 0 && tracks[currentTrackIndex]) {
      const currentTrack = tracks[currentTrackIndex];
      console.log('Current track:', currentTrack);
      
      if (!currentTrack.audio) {
        console.error('No audio found for track:', currentTrack);
        return;
      }

      if (audioRef.current) {
        audioRef.current.src = currentTrack.audio;
        audioRef.current.volume = volume;
        
        const playAudio = async () => {
          try {
            if (isPlaying) {
              const playPromise = audioRef.current.play();
              if (playPromise !== undefined) {
                playPromise.catch(error => {
                  console.error('Audio playback error:', error);
                });
              }
            } else {
              audioRef.current.pause();
            }
          } catch (error) {
            console.error('Audio control error:', error);
          }
        };

        playAudio();
      }
    }
  }, [currentTrackIndex, isPlaying, tracks, volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onerror = (e) => {
        console.error('Audio error:', e);
        setError('Error loading audio file');
      };
    }
  }, []);

  const filteredTracks = tracks.filter(track => 
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const togglePlay = () => {
    if (!tracks[currentTrackIndex]?.audio) {
      console.error('No audio available for current track');
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const changeTrack = (index) => {
    if (index < 0) {
      setCurrentTrackIndex(tracks.length - 1);
    } else if (index >= tracks.length) {
      setCurrentTrackIndex(0);
    } else {
      setCurrentTrackIndex(index);
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  useEffect(() => {
    if (tracks.length > 0) {
      setCurrentBackground(tracks[currentTrackIndex]?.backgroundImageURL);
    }
  }, [currentTrackIndex, tracks]);

  if (isLoading) {
    return (
      <Container>
        <LoadingMessage>Loading tracks...</LoadingMessage>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>Error: {error}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container $background={currentBackground}>
      <audio ref={audioRef} />
      <GlassPanel>
        <Sidebar>
          <Logo>
            <LogoImage src={logo}/>
            <LogoText>EarthlingAI</LogoText>
          </Logo>

          <SearchContainer>
            <FontAwesomeIcon icon={faSearch} />
            <SearchInput
              placeholder="Search tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>

          <TrackList>
            {filteredTracks.map((track, index) => (
              <TrackItem 
                key={track.id}
                onClick={() => changeTrack(index)}
                $active={index === currentTrackIndex}
              >
                <TrackArt src={track.mainImageURL} />
                <TrackInfo>
                  <TrackTitle>{track.title}</TrackTitle>
                  <TrackArtist>{track.username}</TrackArtist>
                </TrackInfo>
                <TrackDuration>3:45</TrackDuration>
              </TrackItem>
            ))}
          </TrackList>
        </Sidebar>

        <MainContent>
          <VisualizerContainer>
            <AnimatedDisk $isPlaying={isPlaying}>
              <DiskImage src={tracks[currentTrackIndex]?.mainImageURL} />
              <DiskOverlay />
            </AnimatedDisk>

            <TrackDetails>
              <TrackTitle>{tracks[currentTrackIndex]?.title}</TrackTitle>
              <TrackArtist>{tracks[currentTrackIndex]?.username}</TrackArtist>
              <TrackStats>
                <StatItem>
                  <StatValue>{tracks[currentTrackIndex]?.likes?.toLocaleString()}</StatValue>
                  <StatLabel>Likes</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{tracks[currentTrackIndex]?.rating?.toFixed(1)}</StatValue>
                  <StatLabel>Rating</StatLabel>
                </StatItem>
              </TrackStats>
            </TrackDetails>
          </VisualizerContainer>

          <ControlsContainer>
            <ControlButton onClick={() => changeTrack(currentTrackIndex - 1)}>
              <FontAwesomeIcon icon={faBackward} />
            </ControlButton>
            
            <PlayButton onClick={togglePlay} $isPlaying={isPlaying}>
              {isPlaying ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
            </PlayButton>
            
            <ControlButton onClick={() => changeTrack(currentTrackIndex + 1)}>
              <FontAwesomeIcon icon={faForward} />
            </ControlButton>
            
            <VolumeControl>
              <FontAwesomeIcon icon={faVolumeHigh} />
              <VolumeSlider
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
              />
            </VolumeControl>
          </ControlsContainer>

          <WaveVisualizer>
            {[...Array(24)].map((_, i) => (
              <WaveBar key={i} $isPlaying={isPlaying} />
            ))}
          </WaveVisualizer>
        </MainContent>
      </GlassPanel>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  background: ${props => props.$background ? `url(${props.$background})` : 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)'};
  background-size: cover;
  background-position: center;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GlassPanel = styled.div`
  width: 90%;
  max-width: 1200px;
  height: 90vh;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  display: flex;
  position: relative;
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 350px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  height: 100%;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const LogoImage = styled.img`
  width: 40px;
  height: 40px;
  animation: ${rotate} 3s linear infinite;
  animation-play-state: ${props => props.$isPlaying ? 'running' : 'paused'};
`;

const LogoText = styled.span`
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(45deg, #fff, #aaa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const TrackList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
  margin-top: 2rem;
  max-height: calc(90vh - 180px); /* Adjust based on Logo and SearchContainer height */
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
`;

const TrackItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 0.5rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  ${props => props.$active && css`
    background: rgba(255, 255, 255, 0.15);
  `}
`;

const TrackArt = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  margin-right: 1rem;
`;

const MainContent = styled.div`
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: -webkit-fill-available;
`;

const VisualizerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 2rem;
`;

const AnimatedDisk = styled.div`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  position: relative;
  animation: ${rotate} 20s linear infinite;
  animation-play-state: ${props => props.$isPlaying ? 'running' : 'paused'};
`;

const DiskImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
`;

const DiskOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1));
`;

const WaveVisualizer = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
  height: 100px;
  align-items: flex-end;
`;

const WaveBar = styled.div`
  width: 4px;
  height: 20px;
  background: rgba(255, 255, 255, 0.7);
  margin: 0 2px;
  border-radius: 2px;
  animation: ${wave} 1.2s ease infinite;
  animation-play-state: ${props => props.$isPlaying ? 'running' : 'paused'};
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
`;

const SearchInput = styled.input`
  background: none;
  border: none;
  color: white;
  width: 100%;
  outline: none;
  font-size: 0.9rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const TrackInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const TrackTitle = styled.span`
  color: white;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.2rem;
`;

const TrackArtist = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
`;

const TrackDuration = styled.span`
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.8rem;
`;

const TrackDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
`;

const TrackStats = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
`;

const StatValue = styled.span`
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
`;

const StatLabel = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
`;

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin: 2rem 0;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.2);
  }
`;

const PlayButton = styled(ControlButton)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.$isPlaying ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.2);
    background: rgba(255, 255, 255, 0.25);
  }
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
`;

const VolumeSlider = styled.input`
  -webkit-appearance: none;
  width: 100px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
  }
`;

const LoadingMessage = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  text-align: center;
  margin-top: 20vh;
`;

const ErrorMessage = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  text-align: center;
  margin-top: 20vh;
`;

export default DJPlayer;