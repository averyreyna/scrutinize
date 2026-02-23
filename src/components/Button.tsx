import styled from 'styled-components';
import { theme } from '../theme';

export const PrimaryButton = styled.button`
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  border: none;
  border-radius: 4px;
  padding: 0.45rem 1rem;
  font-size: 0.97em;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${theme.colors.primaryHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  background: #eee;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 0.45rem 1rem;
  font-size: 0.97em;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #e0e0e0;
  }
`;

export const SmallPrimaryButton = styled(PrimaryButton)`
  padding: 4px 12px;
  font-size: 0.9em;
`;

export const SmallSecondaryButton = styled(SecondaryButton)`
  padding: 4px 12px;
  font-size: 0.9em;
`;
