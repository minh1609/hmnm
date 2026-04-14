/**
 * Export Firestore data to a JSON snapshot file.
 *
 * Reads every document in timeline_events and trips (owner == 'mindy')
 * and writes them to a single JSON file.  Timestamps are serialised as
 * ISO 8601 strings so the file is human-readable and portable.
 *
 * Usage:
 *   npm run db:export
 *
 * Options (env vars):
 *   SERVICE_ACCOUNT   Path to service-account JSON (default: migrations/service-account.json)
 *   OUTPUT            Destination file path       (default: migrations/backup.json)
 *   OWNER             Firestore owner field value  (default: mindy)
 *
 * Examples:
 *   npm run db:export
 *   OUTPUT=./snapshots/2026-04-14.json npm run db:export
 */

import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Timestamp } from 'firebase-admin/firestore';
import { db, log, serviceAccountPath, timestampToISO } from './lib/admin.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const owner = process.env.OWNER ?? 'mindy';
const outputPath = process.env.OUTPUT
    ? resolve(process.env.OUTPUT)
    : resolve(__dirname, 'backup.json');

// ---------------------------------------------------------------------------
// Serialisers
// ---------------------------------------------------------------------------

function serializeValue(value: unknown): unknown {
    if (value instanceof Timestamp) return timestampToISO(value);
    if (Array.isArray(value)) return value.map(serializeValue);
    if (value !== null && typeof value === 'object') {
        return Object.fromEntries(
            Object.entries(value as Record<string, unknown>).map(([k, v]) => [
                k,
                serializeValue(v),
            ]),
        );
    }
    return value;
}

// ---------------------------------------------------------------------------
// Exporters
// ---------------------------------------------------------------------------

async function exportCollection(
    collectionName: string,
    ownerField: string,
): Promise<Record<string, unknown>[]> {
    log('export', `Reading ${collectionName} (${ownerField} == '${owner}')…`);
    const snap = await db
        .collection(collectionName)
        .where(ownerField, '==', owner)
        .get();
    log('export', `  found ${snap.docs.length} document(s)`);

    return snap.docs.map((doc) => ({
        _id: doc.id,
        ...(serializeValue(doc.data()) as Record<string, unknown>),
    }));
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
    log('export', `Service account: ${serviceAccountPath}`);
    log('export', `Owner: ${owner}`);
    log('export', `Output: ${outputPath}`);
    console.log();

    const [timeline_events, trips] = await Promise.all([
        exportCollection('timeline_events', 'owner'),
        exportCollection('trips', 'owner'),
    ]);

    const snapshot = {
        exportedAt: new Date().toISOString(),
        owner,
        timeline_events,
        trips,
    };

    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, JSON.stringify(snapshot, null, 2), 'utf-8');

    console.log();
    log('export', `Done! Wrote ${timeline_events.length} event(s) and ${trips.length} trip(s) to:`);
    log('export', `  ${outputPath}`);
}

main().catch((err) => {
    console.error('[export] ERROR:', err);
    process.exit(1);
});
