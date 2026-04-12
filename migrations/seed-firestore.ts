/**
 * Seed Firestore with timeline events and trips.
 * Objects (IMAGE_FILES, ICONS) are static — not migrated.
 *
 * Usage:
 *   1. Download your Firebase service account key from:
 *      Firebase Console → Project Settings → Service Accounts → Generate new private key
 *   2. Save it as  migrations/service-account.json  (already git-ignored)
 *   3. Run:
 *        npm run migrate
 *      or with a custom path:
 *        SERVICE_ACCOUNT=./path/to/key.json npm run migrate
 *
 * Firestore schema written:
 *   timeline_events/{autoId}  →  { date, name, des?, burstIcon?, owner }
 *   trips/{autoId}            →  { name, flag, startDate, endDate, highlights, destinations, owner }
 *
 * Required composite indexes (firestore.indexes.json):
 *   timeline_events: owner ASC + date ASC
 *   trips:           owner ASC + startDate ASC
 */

import { initializeApp, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

import { timelineEvents } from '@/data/mindy/events';
import { trips } from '@/data/mindy/trips';

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

const __dirname = dirname(fileURLToPath(import.meta.url));

const serviceAccountPath = process.env.SERVICE_ACCOUNT
    ? resolve(process.env.SERVICE_ACCOUNT)
    : resolve(__dirname, 'service-account.json');

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8')) as ServiceAccount;

initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toTimestamp(date: Date): Timestamp {
    return Timestamp.fromDate(date);
}

function log(msg: string) {
    console.log(`[migrate] ${msg}`);
}

/** Delete every document in a collection in batches of 400. */
async function clearCollection(name: string): Promise<void> {
    const col = db.collection(name);
    let deleted = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const snap = await col.limit(400).get();
        if (snap.empty) break;
        const batch = db.batch();
        snap.docs.forEach((d) => batch.delete(d.ref));
        await batch.commit();
        deleted += snap.size;
    }
    log(`  ✗ cleared ${deleted} existing docs from "${name}"`);
}

// ---------------------------------------------------------------------------
// Runners
// ---------------------------------------------------------------------------

async function migrateTimelineEvents() {
    log('Migrating timeline events…');
    await clearCollection('timeline_events');
    const col = db.collection('timeline_events');

    let total = 0;
    for (const event of timelineEvents) {
        const { date, name, des, burstIcon, owner } = event;
        const doc: Record<string, unknown> = {
            date: toTimestamp(date),
            name,
            owner,
        };
        if (des !== undefined) doc.des = des;
        if (burstIcon !== undefined) doc.burstIcon = burstIcon;

        const ref = await col.add(doc);
        log(`  ✓ event "${name}"  (id: ${ref.id})`);
        total++;
    }
    log(`  → ${total} events written`);
}

async function migrateTrips() {
    log('Migrating trips…');
    await clearCollection('trips');
    const col = db.collection('trips');

    for (const trip of trips) {
        const ref = await col.add({
            ...trip,
            startDate: toTimestamp(trip.startDate),
            endDate: toTimestamp(trip.endDate),
        });
        log(`  ✓ trip "${trip.name}"  (id: ${ref.id})`);
    }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
    log('Starting migration');
    log(`Service account: ${serviceAccountPath}`);
    console.log();

    await migrateTimelineEvents();
    console.log();
    await migrateTrips();

    console.log();
    log('All done!');
}

main().catch((err) => {
    console.error('[migrate] ERROR:', err);
    process.exit(1);
});
