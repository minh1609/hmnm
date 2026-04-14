import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, type Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { timelineEvents as staticTimelineEvents, yearDescriptions as staticYearDescriptions } from '@/data';
import type { TimelineEvent, TimelineYear } from '@/types';
import { activeProfile } from '@/config';

function toDate(val: unknown): Date {
    if (val != null && typeof (val as Timestamp).toDate === 'function') {
        return (val as Timestamp).toDate();
    }
    return val as Date;
}

function groupByYear(events: TimelineEvent[], descriptions: Record<number, string>): Record<number, TimelineYear> {
    const result: Record<number, TimelineYear> = {};
    for (const event of events) {
        const year = event.date.getFullYear();
        if (!result[year]) {
            result[year] = { description: descriptions[year] ?? '', events: [] };
        }
        result[year].events.push(event);
    }
    return result;
}

let _timelineCache: TimelineEvent[] | null = null;

/** Call this after any write to timeline_events so the next refetch hits Firestore. */
export function invalidateTimelineCache() {
    _timelineCache = null;
}

export interface UseTimelineResult {
    timeline: Record<number, TimelineYear>;
    refetch: () => void;
}

/**
 * Reads flat `timeline_events` documents from Firestore (owner == activeProfile, ordered by date).
 *
 * Firestore document fields: { date, name, des?, burstIcon?, owner }
 *
 * Results are held in a module-level cache for the tab session. Call
 * `invalidateTimelineCache()` before `refetch()` to force a fresh network read.
 */
export function useTimeline(): UseTimelineResult {
    const [timeline, setTimeline] = useState<Record<number, TimelineYear>>(() =>
        _timelineCache
            ? groupByYear(_timelineCache, staticYearDescriptions)
            : groupByYear(staticTimelineEvents, staticYearDescriptions)
    );
    const [tick, setTick] = useState(0);

    useEffect(() => {
        if (_timelineCache) {
            console.log(`[useTimeline] serving ${_timelineCache.length} events from memory cache`);
            setTimeline(groupByYear(_timelineCache, staticYearDescriptions));
            return;
        }

        const q = query(collection(db, 'timeline_events'), where('owner', '==', activeProfile), orderBy('date', 'asc'));

        getDocs(q)
            .then((snap) => {
                const source = snap.metadata.fromCache ? 'Firestore IndexedDB cache' : 'Firestore network';
                const events: TimelineEvent[] = snap.docs.map((doc) => {
                    const d = doc.data();
                    const event: TimelineEvent = {
                        id: doc.id,
                        date: toDate(d.date),
                        name: d.name as string,
                        owner: d.owner as string,
                    };
                    if (d.des != null) event.des = d.des as string;
                    if (d.burstIcon != null) event.burstIcon = d.burstIcon as string;
                    if (d.gfNote != null) event.gfNote = d.gfNote as string;
                    return event;
                });
                console.log(`[useTimeline] fetched ${events.length} events from ${source}`);
                if (events.length > 0) {
                    _timelineCache = events;
                    setTimeline(groupByYear(events, staticYearDescriptions));
                }
            })
            .catch((err) => {
                console.error('[useTimeline] failed to fetch timeline_events:', err);
            });
    }, [tick]);

    const refetch = () => setTick((t) => t + 1);

    return { timeline, refetch };
}
