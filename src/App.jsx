import React from "react";
import styled from "styled-components";
import logo from "./earthlingai_logo.png";
import TheCube from "./TheCube";

function App() {
  return (
    <PageContainer>
      <Title>Welcome to the EarthlingAI Coding Challenge #1</Title>

      <LogoContainer>
        <TheCube image={logo} />
      </LogoContainer>

      <Instructions>
        This challenge focuses on data visualization and UI design. Please read
        the
        <InstructionLink
          href="https://github.com/EarthlingAI/earthlingai-coding-challenge-1/blob/main/README.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          {" "}
          README.md{" "}
        </InstructionLink>
        file for detailed instructions before starting.
      </Instructions>

      <Footer>
        <FooterText>EarthlingAI Reactor - Project Display</FooterText>
      </Footer>
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
  justify-content: flex-start;
  text-align: center;
  font-size: calc(10px + 1vmin);
  padding: 2rem 1rem;
`;

const Title = styled.h1`
  font-size: calc(16px + 2vmin);
  margin-bottom: 2rem;
  color: #333;
  width: 100%;
  max-width: 800px;
`;

const LogoContainer = styled.div`
  height: 40vmin;
  width: 40vmin;
  pointer-events: none;
  margin: 0 0 2rem 0;
`;

const Instructions = styled.p`
  font-size: calc(10px + 0.8vmin);
  line-height: 1.5;
  color: #555;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 800px;
`;

const InstructionLink = styled.a`
  color: #0066cc;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const Footer = styled.footer`
  margin-top: auto;
  padding: 1rem 0;
`;

const FooterText = styled.p`
  color: #777;
  font-size: 0.9rem;
`;
