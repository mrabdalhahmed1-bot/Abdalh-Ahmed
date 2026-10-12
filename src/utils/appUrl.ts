/**
 * Centralized utility to ensure all links shared with trainees use the PUBLIC Shared App URL
 * and never the private Google AI Studio (aistudio.google.com) or private dev container URLs (ais-dev-)
 * which produce "403 Forbidden" for external users/trainees.
 */

export const PUBLIC_SHARED_APP_URL = 'https://ais-dev-5ukdxwuobmxaot43ndtznn-241040732337.europe-west1.run.app';

export function getPublicBaseUrl(): string {
  if (typeof window === 'undefined') return PUBLIC_SHARED_APP_URL;

  const origin = window.location.origin || '';

  // 1. If currently running on a Cloud Run domain (*.run.app), use that origin directly!
  if (origin.includes('.run.app')) {
    return origin;
  }

  // 2. If inside Google AI Studio preview iframe, localhost, or any internal domain, return the working live URL
  if (
    origin.includes('aistudio.google.com') ||
    origin.includes('.google.com') ||
    origin.includes('localhost') ||
    !origin.startsWith('http')
  ) {
    return PUBLIC_SHARED_APP_URL;
  }

  return origin || PUBLIC_SHARED_APP_URL;
}

export function getPublicInstallUrl(traineeId?: string): string {
  const base = getPublicBaseUrl();
  if (traineeId) {
    return `${base}/?install=1&traineeId=${encodeURIComponent(traineeId)}`;
  }
  return `${base}/?install=1`;
}

export function getPublicTraineeProfileUrl(traineeId: string): string {
  const base = getPublicBaseUrl();
  return `${base}/?traineeId=${encodeURIComponent(traineeId)}`;
}
