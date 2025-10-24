import { PasswordConfig } from '../types';

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SPECIAL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const SIMILAR_CHARS = 'il1Lo0O';

/**
 * Generates a cryptographically secure random password based on the provided configuration
 */
export function generatePassword(config: PasswordConfig): string {
  let charset = '';
  const requiredChars: string[] = [];

  // Build charset based on configuration
  if (config.includeUppercase) {
    const chars = config.excludeSimilar 
      ? UPPERCASE.split('').filter(c => !SIMILAR_CHARS.includes(c)).join('')
      : UPPERCASE;
    charset += chars;
    requiredChars.push(chars[getSecureRandomInt(chars.length)]);
  }

  if (config.includeLowercase) {
    const chars = config.excludeSimilar
      ? LOWERCASE.split('').filter(c => !SIMILAR_CHARS.includes(c)).join('')
      : LOWERCASE;
    charset += chars;
    requiredChars.push(chars[getSecureRandomInt(chars.length)]);
  }

  if (config.includeNumbers) {
    const chars = config.excludeSimilar
      ? NUMBERS.split('').filter(c => !SIMILAR_CHARS.includes(c)).join('')
      : NUMBERS;
    charset += chars;
    requiredChars.push(chars[getSecureRandomInt(chars.length)]);
  }

  if (config.includeSpecialChars) {
    charset += SPECIAL_CHARS;
    requiredChars.push(SPECIAL_CHARS[getSecureRandomInt(SPECIAL_CHARS.length)]);
  }

  // If no character sets selected, use lowercase as default
  if (charset.length === 0) {
    charset = LOWERCASE;
  }

  // Calculate remaining length after required characters
  const remainingLength = Math.max(0, config.length - requiredChars.length);
  
  // Generate random characters for remaining length
  const randomChars: string[] = [];
  for (let i = 0; i < remainingLength; i++) {
    randomChars.push(charset[getSecureRandomInt(charset.length)]);
  }

  // Combine required and random characters
  const allChars = [...requiredChars, ...randomChars];
  
  // Shuffle the array using Fisher-Yates algorithm with cryptographic randomness
  for (let i = allChars.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    [allChars[i], allChars[j]] = [allChars[j], allChars[i]];
  }

  return allChars.join('');
}

/**
 * Generates a cryptographically secure random integer between 0 (inclusive) and max (exclusive)
 */
function getSecureRandomInt(max: number): number {
  const randomBuffer = new Uint32Array(1);
  crypto.getRandomValues(randomBuffer);
  return randomBuffer[0] % max;
}

/**
 * Calculates the entropy of a password based on its character set and length
 */
export function calculateEntropy(password: string): number {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[^A-Za-z0-9]/.test(password);

  let poolSize = 0;
  if (hasUppercase) poolSize += 26;
  if (hasLowercase) poolSize += 26;
  if (hasNumbers) poolSize += 10;
  if (hasSpecialChars) poolSize += 32;

  // Entropy = log2(poolSize^length)
  return Math.log2(Math.pow(poolSize, password.length));
}

/**
 * Copies text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
}
