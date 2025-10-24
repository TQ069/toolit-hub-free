export interface PasswordConfig {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSpecialChars: boolean;
  excludeSimilar: boolean;
}

export interface GeneratedPassword {
  password: string;
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  entropy: number;
  canSave: boolean;
}

export interface PasswordStrengthResult {
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  score: number;
  feedback: string[];
  crackTime: string;
  entropy: number;
}

export interface SavedPassword {
  id: string;
  label: string;
  encryptedPassword: string;
  salt: string;
  iv: string;
  createdAt: Date;
  lastAccessed?: Date;
  metadata: PasswordMetadata;
}

export interface PasswordMetadata {
  length: number;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSpecialChars: boolean;
}

export interface SavePasswordRequest {
  label: string;
  encryptedPassword: string;
  salt: string;
  iv: string;
  metadata: PasswordMetadata;
}
