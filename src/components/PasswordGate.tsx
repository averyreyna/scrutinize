import React, { useEffect, useState, FormEvent } from 'react';
import styled from 'styled-components';

interface PasswordGateProps {
  onUnlock: () => void;
}

const PageWrapper = styled.div`
  position: fixed;
  inset: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  padding: 1rem; /* p-4 */
  overflow: hidden;
`;

const Card = styled.div`
  background: #ffffff; /* bg-white */
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -4px rgba(0, 0, 0, 0.1); /* shadow-lg */
  max-width: 28rem; /* max-w-md */
  width: 100%; /* w-full */
  padding: 1.5rem; /* p-6 */
`;

const Header = styled.div`
  margin-bottom: 1rem; /* mb-4 */
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.25rem; /* text-xl */
  font-weight: 600; /* font-semibold */
  color: #111827; /* text-gray-900 */
  line-height: 1.25; /* leading-tight */

  @media (min-width: 640px) {
    font-size: 1.5rem; /* sm:text-2xl */
  }
`;

const SubTitle = styled.p`
  margin: 0;
  margin-top: 0.25rem; /* mt-1 */
  font-size: 0.75rem; /* text-xs */
  color: #6b7280; /* text-gray-500 */

  @media (min-width: 640px) {
    font-size: 0.875rem; /* sm:text-sm */
  }
`;

const SectionTitle = styled.h2`
  margin: 0 0 0.5rem 0; /* mb-2 */
  font-size: 1.125rem; /* text-lg */
  font-weight: 600; /* font-semibold */
  color: #111827; /* text-gray-900 */
`;

const Description = styled.p`
  margin: 0 0 1rem 0; /* mb-4 */
  font-size: 0.875rem; /* text-sm */
  color: #4b5563; /* text-gray-600 */
`;

const Input = styled.input<{ $state: 'none' | 'valid' | 'invalid' }>`
  width: 100%; /* w-full */
  padding: 0.5rem; /* p-2 */
  border: 1px solid #d1d5db; /* border-gray-300 */
  border-radius: 0.375rem; /* rounded-md */
  margin-bottom: 0.75rem; /* mb-3 */
  font-size: 0.875rem; /* text-sm */
  color: #111827;
  background-color: #ffffff;
  box-sizing: border-box;
  display: block;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  ${(p) =>
    p.$state === 'valid' &&
    `
    border-color: #50E3C2;
    box-shadow: 0 0 0 2px rgba(80, 227, 194, 0.35);
  `}
  ${(p) =>
    p.$state === 'invalid' &&
    `
    border-color: #ef4444;
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.3);
  `}

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    ${(p) =>
      p.$state === 'valid'
        ? `
      border-color: #50E3C2;
      box-shadow: 0 0 0 2px rgba(80, 227, 194, 0.45);
    `
        : p.$state === 'invalid'
          ? `
      border-color: #ef4444;
      box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.4);
    `
          : `
      border-color: #3b82f6; /* blue-500 */
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4); /* focus:ring */
    `}
  }

  @media (min-width: 640px) {
    font-size: 1rem; /* sm:text-base */
  }
`;

const UnlockButton = styled.button<{ $disabled: boolean }>`
  width: 100%; /* w-full */
  padding: 0.5rem 0; /* py-2 */
  border-radius: 0.375rem; /* rounded-md */
  border: 1px solid ${(p) => (p.$disabled ? '#d1d5db' : '#3b82f6')};
  background: ${(p) => (p.$disabled ? '#f3f4f6' : '#3b82f6')};
  color: ${(p) => (p.$disabled ? '#9ca3af' : '#ffffff')};
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
  box-sizing: border-box;
  display: block;
  transition: background-color 0.15s ease, border-color 0.15s ease,
    color 0.15s ease;
  font-size: 0.875rem; /* text-sm-ish */
  font-weight: 500; /* font-medium */

  &:hover {
    background: ${(p) => (p.$disabled ? '#f3f4f6' : '#2563eb')}; /* blue-600 */
    border-color: ${(p) => (p.$disabled ? '#d1d5db' : '#2563eb')};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4); /* focus:ring-blue-400 */
  }

  &:disabled {
    opacity: 1;
  }
`;

const PasswordGate: React.FC<PasswordGateProps> = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  const secret = process.env.REACT_APP_PASSWORD_GATE_SECRET;

  useEffect(() => {
    // Keep the password gate stationary; avoid accidental scroll while it's the only screen.
    if (typeof document === 'undefined') return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const trimmed = password.trim();
  const secretConfigured = Boolean(secret);
  const isValid = secretConfigured && trimmed.length > 0 && trimmed === secret;
  const showInvalid =
    hasAttempted && trimmed.length > 0 && !isValid;

  const validationState: 'none' | 'valid' | 'invalid' = isValid
    ? 'valid'
    : showInvalid
      ? 'invalid'
      : 'none';

  const submitPassword = () => {
    if (!trimmed || isSubmitting) return;
    setHasAttempted(true);

    if (!secret) {
      return;
    }

    setIsSubmitting(true);

    if (trimmed === secret) {
      setIsSubmitting(false);
      onUnlock();
      return;
    }

    setIsSubmitting(false);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submitPassword();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitPassword();
    }
  };

  const isDisabled = isSubmitting || !password.trim();

  return (
    <PageWrapper>
      <Card>
        <Header>
          <Title>Scrutinize</Title>
          <SubTitle>Powered by DeepSeek</SubTitle>
        </Header>

        <SectionTitle>Enter access password</SectionTitle>

        <Description>
          This experiment is lightly gated. Enter the shared password to
          continue.
        </Description>

        <form onSubmit={handleSubmit}>
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            aria-label="Access password"
            aria-invalid={validationState === 'invalid'}
            $state={validationState}
          />

          <UnlockButton
            type="submit"
            disabled={isDisabled}
            aria-label="Unlock Specter"
            $disabled={isDisabled}
          >
            {isSubmitting ? 'Checking...' : 'Unlock'}
          </UnlockButton>
        </form>
      </Card>
    </PageWrapper>
  );
};

export default PasswordGate;
