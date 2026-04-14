/**
 * Import a JSON snapshot file into Firestore.
 *
 * Additive / safe by default — existing documents are NEVER deleted.
 * Deduplication rules:
 *   timeline_events  →  skipped when an existing doc matches date (YYYY-MM-DD) + name
 *   trips            →  skipped when an existing doc matches startDate (YYYY-MM-DD)
 *
 * Documents whose _id is preserved in the snapshot are restored with that
 * exact Firestore document ID (set).  Otherwise a new auto-ID is used (add).
 *
 * Usage:
 *   npm run db:import
 *
 * Options (env vars):
 *   SERVICE_ACCOUNT   Path to service-account JSON (default: migrations/service-account.json)
 *   INPUT             Source snapshot file          (default: migrations/backup.json)
 *   OWNER             Override the owner filter      (default: value stored in snapshot)
 *   RESTORE_IDS       Set to '1' to restore original Firestore document IDs (default: 0)
 *
 * Examples:
 *   npm run db:import
 *   INPUT=./snapshots/2026-04-14.json npm run db:import
 *   INPUT=./snapshots/2026-04-14.json RESTORE_IDS=1 npm run db:import
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
    db,
    log,
    serviceAccountPath,
    isoToTimestamp,
    toDateKey,
} from './lib/admin.js';
import { Timestamp } from 'firebase-admin/firestore';

const __dirname = dirname(fileURLToPath(import.meta.url));

const inputPath = process.env.INPUT
    ? resolve(process.env.INPUT)
    : resolve(__dirname, 'backup.json');

const restoreIds = process.env.RESTORE_IDS === '1';

// ---------------------------------------------------------------------------
// Snapshot types
// ---------------------------------------------------------------------------

interface SnapshotEvent extends Record<string, unknown> {
    _id?: string;
    date: string;
    name: string;
    owner: string;
    des?: string | string[];
    burstIcon?: string;
    gfNote?: string;
}

interface SnapshotTrip extends Record<string, unknown> {
    _id?: string;
    name: string;
    flag: string;
    startDate: string;
    endDate: string;
    highlights: string[];
    destinations: { name: string; googleMapLink?: string }[];
    owner: string;
}

interface Snapshot {
    exportedAt: string;
    owner: string;
    timeline_events: SnapshotEvent[];
    trips: SnapshotTrip[];
}

// ---------------------------------------------------------------------------
// Importers
// ---------------------------------------------------------------------------

async function importTimelineEvents(events: SnapshotEvent[]) {
    log('import', 'Importing timeline_events…');
    const col = db.collection('timeline_events');

    const existingSnap = await col.get();
    const existingKeys = new Set<string>();
    for (const doc of existingSnap.docs) {
        const data = doc.data();
        const dateKey = toDateKey(data.date as Timestamp);
        existingKeys.add(`${dateKey}::${data.name as string}`);
    }
    log('import', `  found ${existingKeys.size} existing event(s) in Firestore`);

    let added = 0;
    let skipped = 0;

    for (const event of events) {
        const { _id, date, name, des, burstIcon, gfNote, owner, ...rest } = event;
        const dateKey = date.slice(0, 10);
        const dedupKey = `${dateKey}::${name}`;

        if (existingKeys.has(dedupKey)) {
            log('import', `  ~ skipped  "${name}" (${dateKey}) — already exists`);
            skipped++;
            continue;
        }

        const doc: Record<string, unknown> = {
            date: isoToTimestamp(date),
            name,
            owner,
            ...rest,
        };
        if (des !== undefined) doc.des = des;
        if (burstIcon !== undefined) doc.burstIcon = burstIcon;
        if (gfNote !== undefined) doc.gfNote = gfNote;

        if (restoreIds && _id) {
            await col.doc(_id).set(doc);
            log('import', `  ✓ restored "${name}" (id: ${_id})`);
        } else {
            const ref = await col.add(doc);
            log('import', `  ✓ added    "${name}" (id: ${ref.id})`);
        }

        existingKeys.add(dedupKey);
        added++;
    }

    log('import', `  → ${added} event(s) added, ${skipped} skipped`);
}

async function importTrips(trips: SnapshotTrip[]) {
    log('import', 'Importing trips…');
    const col = db.collection('trips');

    const existingSnap = await col.get();
    const existingKeys = new Set<string>();
    for (const doc of existingSnap.docs) {
        const data = doc.data();
        existingKeys.add(toDateKey(data.startDate as Timestamp));
    }
    log('import', `  found ${existingKeys.size} existing trip(s) in Firestore`);

    let added = 0;
    let skipped = 0;

    for (const trip of trips) {
        const { _id, startDate, endDate, ...rest } = trip;
        const dateKey = startDate.slice(0, 10);

        if (existingKeys.has(dateKey)) {
            log('import', `  ~ skipped  "${trip.name}" (${dateKey}) — already exists`);
            skipped++;
            continue;
        }

        const doc = {
            ...rest,
            startDate: isoToTimestamp(startDate),
            endDate: isoToTimestamp(endDate),
        };

        if (restoreIds && _id) {
            await col.doc(_id).set(doc);
            log('import', `  ✓ restored "${trip.name}" (id: ${_id})`);
        } else {
            const ref = await col.add(doc);
            log('import', `  ✓ added    "${trip.name}" (id: ${ref.id})`);
        }

        existingKeys.add(dateKey);
        added++;
    }

    log('import', `  → ${added} trip(s) added, ${skipped} skipped`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
    log('import', `Service account: ${serviceAccountPath}`);
    log('import', `Input: ${inputPath}`);
    log('import', `Restore IDs: ${restoreIds}`);
    console.log();

    const raw = readFileSync(inputPath, 'utf-8');
    const snapshot = JSON.parse(raw) as Snapshot;

    log('import', `Snapshot exported at: ${snapshot.exportedAt}`);
    log('import', `Owner in snapshot:    ${snapshot.owner}`);
    log('import', `Events in snapshot:   ${snapshot.timeline_events.length}`);
    log('import', `Trips in snapshot:    ${snapshot.trips.length}`);
    console.log();

    await importTimelineEvents(snapshot.timeline_events);
    console.log();
    await importTrips(snapshot.trips);

    console.log();
    log('import', 'All done!');
}

main().catch((err) => {
    console.error('[import] ERROR:', err);
    process.exit(1);
});
