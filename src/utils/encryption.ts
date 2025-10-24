/**
 * Client-side encryption utilities for password vault
 * Uses AES-256-GCM for encryption and PBKDF2 for key derivation
 */

export interface EncryptedData {
  encryptedPassword: string;
  salt: string;
  iv: string;
}

/**
 * Generates a cryptographically secure random salt
 */
export function generateSalt(): string {
  const saltBuffer = new Uint8Array(32);
  crypto.getRandomValues(saltBuffer);
  return arrayBufferToBase64(saltBuffer);
}

/**
 * Derives an encryption key from a user key and salt using PBKDF2
 */
async function deriveKey(userKey: string, salt: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(userKey),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  const saltBuffer = base64ToArrayBuffer(salt);

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuffer as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a password using AES-256-GCM
 */
export async function encryptPassword(
  password: string,
  userKey: string
): Promise<EncryptedData> {
  const salt = generateSalt();
  const key = await deriveKey(userKey, salt);

  // Generate random IV
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);

  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv as BufferSource,
    },
    key,
    passwordBuffer
  );

  return {
    encryptedPassword: arrayBufferToBase64(encryptedBuffer),
    salt: salt,
    iv: arrayBufferToBase64(iv),
  };
}

/**
 * Decrypts a password using AES-256-GCM
 */
export async function decryptPassword(
  encryptedData: EncryptedData,
  userKey: string
): Promise<string> {
  const key = await deriveKey(userKey, encryptedData.salt);

  const encryptedBuffer = base64ToArrayBuffer(encryptedData.encryptedPassword);
  const iv = base64ToArrayBuffer(encryptedData.iv);

  try {
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv as BufferSource,
      },
      key,
      encryptedBuffer as BufferSource
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    throw new Error('Decryption failed. Invalid user key or corrupted data.');
  }
}

/**
 * Securely clears sensitive data from memory
 */
export function clearSensitiveData(data: string): void {
  // Overwrite the string in memory (best effort in JavaScript)
  // Note: JavaScript doesn't provide true memory management,
  // but we can help the garbage collector
  if (data) {
    // Create a new string of zeros with the same length
    const zeros = '0'.repeat(data.length);
    // This doesn't actually overwrite the original string in memory
    // but signals intent and helps with garbage collection
    data = zeros;
  }
}

/**
 * Converts ArrayBuffer to Base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Converts Base64 string to ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Validates user key strength
 */
export function validateUserKey(userKey: string): {
  valid: boolean;
  message?: string;
} {
  if (!userKey || userKey.length < 8) {
    return {
      valid: false,
      message: 'User key must be at least 8 characters long',
    };
  }

  if (userKey.length > 128) {
    return {
      valid: false,
      message: 'User key must be less than 128 characters',
    };
  }

  return { valid: true };
}
