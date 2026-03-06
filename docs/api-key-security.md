# API Key Security

InfiniteResume lets users bring their own API keys (Google Gemini, OpenRouter) for AI features like resume extraction and analysis. This document explains how those keys are stored and protected.

## Overview

| Property               | Detail                                                |
| ---------------------- | ----------------------------------------------------- |
| **Storage location**   | Browser `localStorage`                                |
| **Encryption**         | AES-256-GCM (Web Crypto API)                          |
| **Key derivation**     | PBKDF2 · SHA-256 · 100 000 iterations                 |
| **Per-user isolation** | Encryption key derived from Clerk `userId` + app salt |
| **Server exposure**    | None — keys never leave the browser                   |

## How It Works

### Saving Keys

```
User enters API key
        ↓
JSON.stringify({ googleApiKey, openrouterApiKey })
        ↓
PBKDF2(userId + appSalt) → AES-256 CryptoKey
        ↓
AES-GCM encrypt (random 12-byte IV)
        ↓
base64(IV + ciphertext) → localStorage["resumeExtractionKeys:v1"]
```

### Loading Keys

```
Read localStorage["resumeExtractionKeys:v1"]
        ↓
base64 decode → extract IV (first 12 bytes) + ciphertext
        ↓
PBKDF2(userId + appSalt) → AES-256 CryptoKey
        ↓
AES-GCM decrypt → JSON.parse → in-memory cache
```

After the initial async load, all subsequent reads within the same page session are **synchronous** from the in-memory cache (`getResumeExtractionSettings()`).

## File Structure

| File                                          | Purpose                                                                                                                                                                  |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/app/utils/crypto-keys.ts`                | `encryptData()`, `decryptData()`, internal `deriveKey()`                                                                                                                 |
| `src/app/utils/resume-extraction-settings.ts` | `loadResumeExtractionSettings(userId)`, `setResumeExtractionSettings(settings, userId)`, `getResumeExtractionSettings()` (sync cache), `clearResumeExtractionSettings()` |

## Security Properties

### What this protects against

- **Casual inspection**: Keys are not visible as plain text in DevTools → Application → Local Storage.
- **Cross-user access**: A different Clerk user on the same browser cannot decrypt another user's keys (different `userId` → different derived key).
- **Server-side leaks**: Keys are never transmitted to any backend — all encryption/decryption happens client-side via the Web Crypto API.

### What this does NOT protect against

- **Full device compromise**: An attacker with access to the browser's memory, extensions, or JS execution context can still extract keys (this is true of any client-side storage).
- **XSS attacks**: If an attacker can execute arbitrary JS on the page, they can call `getResumeExtractionSettings()` directly. Standard XSS mitigations (CSP, input sanitization) are the defense here.

### Encryption Parameters

| Parameter      | Value                                                      |
| -------------- | ---------------------------------------------------------- |
| Algorithm      | AES-GCM                                                    |
| Key length     | 256 bits                                                   |
| IV length      | 96 bits (12 bytes), randomly generated per save            |
| KDF            | PBKDF2                                                     |
| KDF hash       | SHA-256                                                    |
| KDF iterations | 100 000                                                    |
| KDF salt       | Fixed app-level string (`InfiniteResume::ApiKeyVault::v1`) |

## Clearing Keys

Calling `clearResumeExtractionSettings()` removes both `localStorage` entries (`resumeExtractionProvider:v1` and `resumeExtractionKeys:v1`) and resets the in-memory cache to defaults.

Users can clear their keys from **Settings → AI Resume Extraction → Clear Keys**.
