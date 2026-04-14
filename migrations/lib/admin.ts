/**
 * Shared Firebase Admin SDK initializer for migration scripts.
 *
 * Reads the service account key from:
 *   - SERVICE_ACCOUNT env var (path to JSON file), or
 *   - migrations/service-account.json  (default, already git-ignored)
 */

import { initializeApp, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDir = resolve(__dirname, '..');

export const serviceAccountPath = process.env.SERVICE_ACCOUNT
    ? resolve(process.env.SERVICE_ACCOUNT)
    : resolve(migrationsDir, 'service-account.json');

const serviceAccount = JSON.parse(
    readFileSync(serviceAccountPath, 'utf-8'),
) as ServiceAccount;

initializeApp({ credential: cert(serviceAccount) });

export const db = getFirestore();

// ---------------------------------------------------------------------------
// Date helpers shared across scripts
// ---------------------------------------------------------------------------

/** Convert a JS Date to a Firestore Timestamp. */
export function toTimestamp(date: Date): Timestamp {
    return Timestamp.fromDate(date);
}

/** Convert a Firestore Timestamp (or Date) to a YYYY-MM-DD string. */
export function toDateKey(value: Date | Timestamp): string {
    const d = value instanceof Date ? value : value.toDate();
    return d.toISOString().slice(0, 10);
}

/** Serialize a Firestore Timestamp to an ISO 8601 string for JSON output. */
export function timestampToISO(ts: Timestamp): string {
    return ts.toDate().toISOString();
}

/** Parse an ISO 8601 string back to a Firestore Timestamp for import. */
export function isoToTimestamp(iso: string): Timestamp {
    return Timestamp.fromDate(new Date(iso));
}

export function log(prefix: string, msg: string) {
    console.log(`[${prefix}] ${msg}`);
}
