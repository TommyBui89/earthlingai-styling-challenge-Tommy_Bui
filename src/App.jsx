import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faPause,
  faForward,
  faBackward,
  faHeart,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';

import logo from './earthlingai_logo.png';

// Color scheme
const colors = {
  primary: '#000000',
  secondary: '#FF3B30',
  background: '#111111',
  text: '#FFFFFF',
  muted: '#888888'
};

function App() {
  const [projects, setProjects] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [searchQuery, setSearchQuery] = useState('');
  const audioRef = useRef(null);

  useEffect(() => {
    fetch('https://earthlingai.app/download/projects.json')
      .then(response => response.json())
      .then(data => {
        const audioProjects = data.filter(
          project => project.audio && project.isPublicProject
        );
        setProjects(audioProjects);
        
        if (audioProjects.length > 0) {
          audioRef.current = new Audio(audioProjects[0].audio);
          audioRef.current.volume = volume;
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [volume]);

  // Player controls
  const playAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
  };

  const pauseAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const changeTrack = (index) => {
    const newIndex = Math.max(0, Math.min(index, projects.length - 1));
    setCurrentTrackIndex(newIndex);
    audioRef.current.src = projects[newIndex].audio;
    if (isPlaying) audioRef.current.play();
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (projects.length === 0) return <Loading>Loading projects...</Loading>;

  const currentProject = projects[currentTrackIndex];

  return (
    <Layout>
      <Sidebar>
        <LogoContainer>
          <Logo src={logo} alt="EarthlingAI Logo" />
          EARTHLINGAI
        </LogoContainer>
        
        <SearchContainer>
          <FontAwesomeIcon icon={faSearch} />
          <SearchInput
            placeholder="Search tracks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>

        <PlaylistSection>
          <SectionTitle>YOUR LIBRARY</SectionTitle>
          {projects.slice(0, 3).map((project, index) => (
            <PlaylistItem key={index}>
              <PlaylistCover src={project.mainImageURL} />
              <PlaylistInfo>
                <PlaylistName>{project.title}</PlaylistName>
                <PlaylistCount>{project.likes.toLocaleString()} likes</PlaylistCount>
              </PlaylistInfo>
            </PlaylistItem>
          ))}
        </PlaylistSection>
      </Sidebar>

      <MainContent>
        <TrackGrid>
          <TrackHeader>
            <div>#</div>
            <div>Title</div>
            <div>Creator</div>
            <div>Likes</div>
            <div>Rating</div>
          </TrackHeader>
          
          {filteredProjects.map((project, index) => (
            <TrackItem
              key={project.id}
              onClick={() => changeTrack(index)}
              active={index === currentTrackIndex}
            >
              <div>{index + 1}</div>
              <TrackInfo>
                <TrackCover src={project.mainImageURL} />
                <div>
                  <TrackTitle>{project.title}</TrackTitle>
                </div>
              </TrackInfo>
              <TrackArtist>{project.username}</TrackArtist>
              <div><HeartIcon icon={faHeart} /> {project.likes.toLocaleString()}</div>
              <div><Rating>{project.rating.toFixed(1)}</Rating></div>
            </TrackItem>
          ))}
        </TrackGrid>
      </MainContent>

      <PlayerContainer>
        <NowPlaying>
          <AlbumArt src={currentProject.mainImageURL} />
          <TrackDetails>
            <TrackTitle>{currentProject.title}</TrackTitle>
            <Artist>{currentProject.username}</Artist>
          </TrackDetails>
        </NowPlaying>

        <PlayerControls>
          <ControlButton onClick={() => changeTrack(currentTrackIndex - 1)}>
            <FontAwesomeIcon icon={faBackward} />
          </ControlButton>
          <PlayButton onClick={isPlaying ? pauseAudio : playAudio}>
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
          </PlayButton>
          <ControlButton onClick={() => changeTrack(currentTrackIndex + 1)}>
            <FontAwesomeIcon icon={faForward} />
          </ControlButton>
        </PlayerControls>

        <VolumeControl>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => {
              const newVolume = parseFloat(e.target.value);
              setVolume(newVolume);
              audioRef.current.volume = newVolume;
            }}
          />
        </VolumeControl>
      </PlayerContainer>
    </Layout>
  );
}

// Styled components with UI/UX best practices
const Layout = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 1fr auto;
  background: ${colors.primary};
  color: ${colors.text};
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  background: ${colors.background};
  padding: 2rem;
  border-right: 1px solid ${colors.secondary}33;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.secondary};
`;

const Logo = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 1rem;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: ${colors.primary};
  border-radius: 8px;
  padding: 0.8rem 1rem;
  margin-bottom: 2rem;
  gap: 0.8rem;
`;

const SearchInput = styled.input`
  background: none;
  border: none;
  color: ${colors.text};
  width: 100%;
  font-size: 0.9rem;
  
  &::placeholder {
    color: ${colors.muted};
  }
`;

const PlaylistSection = styled.div`
  margin-top: auto;
`;

const SectionTitle = styled.h3`
  color: ${colors.muted};
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1.5rem;
`;

const PlaylistItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  gap: 1rem;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    background: ${colors.secondary}15;
  }
`;

const PlaylistCover = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 4px;
  object-fit: cover;
`;

const PlaylistInfo = styled.div`
  flex: 1;
`;

const PlaylistName = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const PlaylistCount = styled.div`
  color: ${colors.muted};
  font-size: 0.8rem;
`;

const MainContent = styled.main`
  padding: 2rem;
  overflow-y: auto;
`;

const TrackGrid = styled.div`
  display: grid;
  grid-template-columns: 50px 3fr 2fr 1fr 1fr;
  gap: 1rem;
`;

const TrackHeader = styled.div`
  display: contents;
  color: ${colors.muted};
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${colors.secondary}33;
  
  > div {
    padding: 0.5rem 1rem;
  }
`;

const TrackItem = styled.div`
  display: contents;
  cursor: pointer;
  transition: all 0.2s ease;
  
  > div {
    padding: 1rem;
    display: flex;
    align-items: center;
    border-radius: 8px;
    background: ${({ active }) => active ? `${colors.secondary}15` : 'transparent'};
  }

  &:hover > div {
    background: ${colors.secondary}10;
  }
`;

const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TrackCover = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
`;

const TrackTitle = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const TrackArtist = styled.div`
  color: ${colors.muted};
  font-size: 0.9rem;
`;

const HeartIcon = styled(FontAwesomeIcon)`
  color: ${colors.secondary};
  margin-right: 0.5rem;
`;

const Rating = styled.div`
  padding: 0.25rem 0.75rem;
  background: ${colors.secondary}15;
  border-radius: 20px;
  font-weight: 500;
`;

const PlayerContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: ${colors.background};
  border-top: 1px solid ${colors.secondary}33;
`;

const NowPlaying = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
`;

const AlbumArt = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 4px;
  object-fit: cover;
`;

const TrackDetails = styled.div`
  min-width: 200px;
`;

const Artist = styled.div`
  color: ${colors.muted};
  font-size: 0.9rem;
`;

const PlayerControls = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 2rem;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: ${colors.text};
  font-size: 1.2rem;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${colors.secondary};
    transform: scale(1.1);
  }
`;

const PlayButton = styled(ControlButton)`
  font-size: 1.5rem;
  padding: 0.5rem 1rem;
  background: ${colors.secondary};
  color: ${colors.primary};
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: scale(1.05);
    filter: brightness(1.1);
  }
`;

const VolumeControl = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  
  input {
    width: 120px;
    accent-color: ${colors.secondary};
  }
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: ${colors.text};
`;

export default App;