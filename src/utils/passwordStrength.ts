import { PasswordStrengthResult } from '../types';

const COMMON_PASSWORDS = [
  'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', '1234567',
  'letmein', 'trustno1', 'dragon', 'baseball', 'iloveyou', 'master', 'sunshine',
  'ashley', 'bailey', 'passw0rd', 'shadow', '123123', '654321', 'superman',
  'qazwsx', 'michael', 'football'
];

const COMMON_PATTERNS = [
  /^(.)\1+$/, // Repeated character (aaaa, 1111)
  /^(01|12|23|34|45|56|67|78|89|90)+$/, // Sequential numbers
  /^(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)+$/i, // Sequential letters
  /^(qwerty|asdfgh|zxcvbn)+$/i, // Keyboard patterns
];

/**
 * Analyzes password strength and provides detailed feedback
 */
export function analyzePasswordStrength(password: string): PasswordStrengthResult {
  if (!password || password.length === 0) {
    return {
      strength: 'weak',
      score: 0,
      feedback: ['Password is empty'],
      crackTime: 'Instant',
      entropy: 0,
    };
  }

  const feedback: string[] = [];
  let score = 0;

  // Check length
  if (password.length < 8) {
    feedback.push('Password should be at least 8 characters long');
  } else if (password.length >= 8 && password.length < 12) {
    score += 1;
  } else if (password.length >= 12 && password.length < 16) {
    score += 2;
  } else {
    score += 3;
  }

  // Check character variety
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[^A-Za-z0-9]/.test(password);

  const varietyCount = [hasUppercase, hasLowercase, hasNumbers, hasSpecialChars].filter(Boolean).length;

  if (varietyCount === 1) {
    feedback.push('Add different types of characters (uppercase, lowercase, numbers, symbols)');
  } else if (varietyCount === 2) {
    score += 1;
    feedback.push('Good variety, but consider adding more character types');
  } else if (varietyCount === 3) {
    score += 2;
    feedback.push('Great variety of character types');
  } else if (varietyCount === 4) {
    score += 3;
    feedback.push('Excellent variety of character types');
  }

  // Check for common passwords
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
    score = Math.max(0, score - 3);
    feedback.push('This is a commonly used password');
  }

  // Check for common patterns
  for (const pattern of COMMON_PATTERNS) {
    if (pattern.test(password)) {
      score = Math.max(0, score - 2);
      feedback.push('Avoid predictable patterns');
      break;
    }
  }

  // Check for repeated characters
  const repeatedChars = /(.)\1{2,}/.test(password);
  if (repeatedChars) {
    score = Math.max(0, score - 1);
    feedback.push('Avoid repeating characters');
  }

  // Calculate entropy
  const entropy = calculateEntropy(password);

  // Determine strength based on score
  let strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  if (score <= 2) {
    strength = 'weak';
  } else if (score <= 4) {
    strength = 'medium';
  } else if (score <= 6) {
    strength = 'strong';
  } else {
    strength = 'very-strong';
  }

  // Calculate crack time
  const crackTime = estimateCrackTime(entropy);

  // Add positive feedback if no issues found
  if (feedback.length === 0 || (feedback.length === 1 && feedback[0].includes('Great') || feedback[0].includes('Excellent'))) {
    if (strength === 'very-strong') {
      feedback.push('This is a very strong password');
    } else if (strength === 'strong') {
      feedback.push('This is a strong password');
    }
  }

  return {
    strength,
    score,
    feedback,
    crackTime,
    entropy,
  };
}

/**
 * Calculates the entropy of a password
 */
function calculateEntropy(password: string): number {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[^A-Za-z0-9]/.test(password);

  let poolSize = 0;
  if (hasUppercase) poolSize += 26;
  if (hasLowercase) poolSize += 26;
  if (hasNumbers) poolSize += 10;
  if (hasSpecialChars) poolSize += 32;

  if (poolSize === 0) return 0;

  // Entropy = log2(poolSize^length)
  return Math.log2(Math.pow(poolSize, password.length));
}

/**
 * Estimates the time it would take to crack a password based on its entropy
 * Assumes 1 billion guesses per second (modern GPU)
 */
function estimateCrackTime(entropy: number): string {
  const guessesPerSecond = 1e9; // 1 billion guesses per second
  const possibleCombinations = Math.pow(2, entropy);
  const secondsToCrack = possibleCombinations / (2 * guessesPerSecond); // Divide by 2 for average case

  if (secondsToCrack < 1) {
    return 'Instant';
  } else if (secondsToCrack < 60) {
    return `${Math.round(secondsToCrack)} seconds`;
  } else if (secondsToCrack < 3600) {
    return `${Math.round(secondsToCrack / 60)} minutes`;
  } else if (secondsToCrack < 86400) {
    return `${Math.round(secondsToCrack / 3600)} hours`;
  } else if (secondsToCrack < 2592000) {
    return `${Math.round(secondsToCrack / 86400)} days`;
  } else if (secondsToCrack < 31536000) {
    return `${Math.round(secondsToCrack / 2592000)} months`;
  } else if (secondsToCrack < 3153600000) {
    return `${Math.round(secondsToCrack / 31536000)} years`;
  } else if (secondsToCrack < 31536000000) {
    return `${Math.round(secondsToCrack / 3153600000)} centuries`;
  } else {
    return 'Millions of years';
  }
}
