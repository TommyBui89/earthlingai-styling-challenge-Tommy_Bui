import logo from "./earthlingai_logo.png";
import styled, { keyframes } from "styled-components";

function App() {
  return (
    <PageContainer>
      <AppLogo src={logo} alt="logo" />
      <Text>Welcome to the EarthlingAI Coding Challenge #1</Text>
    </PageContainer>
  );
}

export default App;

// Define styling using styled components - you can modify/delete existing components below

const PageContainer = styled.div`
  background-color: rgb(255, 255, 255);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: calc(10px + 2vmin);
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const AppLogo = styled.img`
  height: 40vmin;
  pointer-events: none;
  animation: ${spin} infinite 20s linear;
`;

const Text = styled.p`
  color: black;
`;
