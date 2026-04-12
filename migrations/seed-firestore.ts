/**
 * Seed Firestore with timeline events and trips.
 * Objects (IMAGE_FILES, ICONS) are static — not migrated.
 *
 * Safe / additive migration: existing documents are NEVER deleted.
 * A static event is skipped when Firestore already has an event with the
 * same date (YYYY-MM-DD) AND name.
 * A static trip is skipped when Firestore already has a trip with the
 * same startDate (YYYY-MM-DD).
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
 * To grant admin role to a user (find their UID in Firebase Console → Authentication):
 *   ADMIN_UID=<uid> npm run migrate
 *
 * Firestore schema written:
 *   timeline_events/{autoId}  →  { date, name, des?, burstIcon?, owner }
 *   trips/{autoId}            →  { name, flag, startDate, endDate, highlights, destinations, owner }
 *   users/{uid}               →  { role: 'admin', email? }
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

/** Returns a YYYY-MM-DD string for a Date or Firestore Timestamp. */
function toDateKey(value: Date | Timestamp): string {
    const d = value instanceof Date ? value : value.toDate();
    return d.toISOString().slice(0, 10);
}

function log(msg: string) {
    console.log(`[migrate] ${msg}`);
}

// ---------------------------------------------------------------------------
// Runners
// ---------------------------------------------------------------------------

async function migrateTimelineEvents() {
    log('Migrating timeline events…');
    const col = db.collection('timeline_events');

    // Build a set of existing (dateKey, name) pairs so we can skip duplicates.
    const existingSnap = await col.where('owner', '==', 'mindy').get();
    const existingKeys = new Set<string>();
    for (const doc of existingSnap.docs) {
        const data = doc.data();
        const dateKey = toDateKey(data.date as Timestamp);
        existingKeys.add(`${dateKey}::${data.name as string}`);
    }
    log(`  found ${existingKeys.size} existing event(s) in Firestore`);

    let added = 0;
    let skipped = 0;
    for (const event of timelineEvents) {
        const { date, name, des, burstIcon, owner } = event;
        const key = `${toDateKey(date)}::${name}`;

        if (existingKeys.has(key)) {
            log(`  ~ skipped  "${name}" (${toDateKey(date)}) — already exists`);
            skipped++;
            continue;
        }

        const doc: Record<string, unknown> = {
            date: toTimestamp(date),
            name,
            owner,
        };
        if (des !== undefined) doc.des = des;
        if (burstIcon !== undefined) doc.burstIcon = burstIcon;

        const ref = await col.add(doc);
        log(`  ✓ added    "${name}"  (id: ${ref.id})`);
        added++;
    }
    log(`  → ${added} event(s) added, ${skipped} skipped`);
}

async function migrateTrips() {
    log('Migrating trips…');
    const col = db.collection('trips');

    // Build a set of existing startDate keys.
    const existingSnap = await col.where('owner', '==', 'mindy').get();
    const existingKeys = new Set<string>();
    for (const doc of existingSnap.docs) {
        const data = doc.data();
        existingKeys.add(toDateKey(data.startDate as Timestamp));
    }
    log(`  found ${existingKeys.size} existing trip(s) in Firestore`);

    let added = 0;
    let skipped = 0;
    for (const trip of trips) {
        const key = toDateKey(trip.startDate);

        if (existingKeys.has(key)) {
            log(`  ~ skipped  "${trip.name}" (${key}) — already exists`);
            skipped++;
            continue;
        }

        const ref = await col.add({
            ...trip,
            startDate: toTimestamp(trip.startDate),
            endDate: toTimestamp(trip.endDate),
        });
        log(`  ✓ added    "${trip.name}"  (id: ${ref.id})`);
        added++;
    }
    log(`  → ${added} trip(s) added, ${skipped} skipped`);
}

// ---------------------------------------------------------------------------
// Admin user
// ---------------------------------------------------------------------------

async function migrateAdminUser(uid: string) {
    log(`Granting admin role to uid: ${uid}`);
    const ref = db.collection('users').doc(uid);
    const snap = await ref.get();
    if (snap.exists && snap.data()?.role === 'admin') {
        log('  ~ skipped — already admin');
        return;
    }
    await ref.set({ role: 'admin' }, { merge: true });
    log('  ✓ users/' + uid + ' → { role: "admin" }');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
    log('Starting migration (additive — existing data is preserved)');
    log(`Service account: ${serviceAccountPath}`);
    console.log();

    // await migrateTimelineEvents();
    console.log();
    // await migrateTrips();

    const adminUid = process.env.ADMIN_UID;
    if (adminUid) {
        console.log();
        await migrateAdminUser(adminUid);
    }

    console.log();
    log('All done!');
}

main().catch((err) => {
    console.error('[migrate] ERROR:', err);
    process.exit(1);
});
