/**
 * Seed Firestore from static source data in src/data/.
 * Objects (IMAGE_FILES, ICONS) are static — not migrated.
 *
 * Safe / additive — existing documents are NEVER deleted.
 * A static event is skipped when Firestore already has an event with the
 * same date (YYYY-MM-DD) AND name.
 * A static trip is skipped when Firestore already has a trip with the
 * same startDate (YYYY-MM-DD).
 *
 * Usage:
 *   npm run migrate
 *
 * Options (env vars):
 *   SERVICE_ACCOUNT   Path to service-account JSON (default: migrations/service-account.json)
 *   ADMIN_UID         Firebase UID to grant the admin role
 *
 * Firestore schema written:
 *   timeline_events/{autoId}  →  { date, name, des?, burstIcon?, gfNote?, owner }
 *   trips/{autoId}            →  { name, flag, startDate, endDate, highlights, destinations, owner }
 *   users/{uid}               →  { role: 'admin' }
 */

import { Timestamp } from 'firebase-admin/firestore';
import { db, log, toTimestamp, toDateKey, serviceAccountPath } from './lib/admin.js';
import { timelineEvents } from '@/data/mindy/events';
import { trips } from '@/data/mindy/trips';

// ---------------------------------------------------------------------------
// Runners
// ---------------------------------------------------------------------------

async function migrateTimelineEvents() {
    log('seed', 'Migrating timeline events…');
    const col = db.collection('timeline_events');

    const existingSnap = await col.where('owner', '==', 'mindy').get();
    const existingKeys = new Set<string>();
    for (const doc of existingSnap.docs) {
        const data = doc.data();
        const dateKey = toDateKey(data.date as Timestamp);
        existingKeys.add(`${dateKey}::${data.name as string}`);
    }
    log('seed', `  found ${existingKeys.size} existing event(s) in Firestore`);

    let added = 0;
    let skipped = 0;
    for (const event of timelineEvents) {
        const { date, name, des, burstIcon, owner } = event;
        const key = `${toDateKey(date)}::${name}`;

        if (existingKeys.has(key)) {
            log('seed', `  ~ skipped  "${name}" (${toDateKey(date)}) — already exists`);
            skipped++;
            continue;
        }

        const doc: Record<string, unknown> = { date: toTimestamp(date), name, owner };
        if (des !== undefined) doc.des = des;
        if (burstIcon !== undefined) doc.burstIcon = burstIcon;

        const ref = await col.add(doc);
        log('seed', `  ✓ added    "${name}"  (id: ${ref.id})`);
        added++;
    }
    log('seed', `  → ${added} event(s) added, ${skipped} skipped`);
}

async function migrateTrips() {
    log('seed', 'Migrating trips…');
    const col = db.collection('trips');

    const existingSnap = await col.where('owner', '==', 'mindy').get();
    const existingKeys = new Set<string>();
    for (const doc of existingSnap.docs) {
        const data = doc.data();
        existingKeys.add(toDateKey(data.startDate as Timestamp));
    }
    log('seed', `  found ${existingKeys.size} existing trip(s) in Firestore`);

    let added = 0;
    let skipped = 0;
    for (const trip of trips) {
        const key = toDateKey(trip.startDate);

        if (existingKeys.has(key)) {
            log('seed', `  ~ skipped  "${trip.name}" (${key}) — already exists`);
            skipped++;
            continue;
        }

        const ref = await col.add({
            ...trip,
            startDate: toTimestamp(trip.startDate),
            endDate: toTimestamp(trip.endDate),
        });
        log('seed', `  ✓ added    "${trip.name}"  (id: ${ref.id})`);
        added++;
    }
    log('seed', `  → ${added} trip(s) added, ${skipped} skipped`);
}

async function migrateAdminUser(uid: string) {
    log('seed', `Granting admin role to uid: ${uid}`);
    const ref = db.collection('users').doc(uid);
    const snap = await ref.get();
    if (snap.exists && snap.data()?.role === 'admin') {
        log('seed', '  ~ skipped — already admin');
        return;
    }
    await ref.set({ role: 'admin' }, { merge: true });
    log('seed', `  ✓ users/${uid} → { role: "admin" }`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
    log('seed', 'Starting migration (additive — existing data is preserved)');
    log('seed', `Service account: ${serviceAccountPath}`);
    console.log();

    await migrateTimelineEvents();
    console.log();
    await migrateTrips();

    const adminUid = process.env.ADMIN_UID;
    if (adminUid) {
        console.log();
        await migrateAdminUser(adminUid);
    }

    console.log();
    log('seed', 'All done!');
}

main().catch((err) => {
    console.error('[seed] ERROR:', err);
    process.exit(1);
});
