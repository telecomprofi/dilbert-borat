import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 1.2rem 2.5rem;
  background-color: #0070f3;
  color: white;
  font-size: 1.4rem;
  font-weight: bold;
  border: 3px solid #0051a2;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 2rem auto;
  display: block;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 112, 243, 0.3);
  white-space: normal;
  word-wrap: break-word;
  line-height: 1.4;
  position: relative;
  z-index: 3;
  pointer-events: auto;
  width: 100%;
  max-width: 600px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  min-height: 60px;

  &:hover {
    background-color: #0051a2;
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 112, 243, 0.4);
    border-color: #003d7a;
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(0, 112, 243, 0.3);
    background-color: #0046b3;
  }
`;

const RoundButton = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};

export default RoundButton; 