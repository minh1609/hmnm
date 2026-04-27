export interface ImageFile {
    file: string;
    label: string;
}

export interface Icon {
    symbol: string;
    color: string;
    label: string;
}

export type TripType = 'trip' | 'meaningful' | 'plan';

export interface TripDestination {
    name: string;
    googleMapLink?: string;
}

export interface Trip {
    name: string;
    flag: string;
    /** Firestore index */
    startDate?: Date;
    /** Firestore index */
    endDate?: Date;
    destinations?: TripDestination[];
    /** [longitude, latitude] for map pin placement */
    coordinates: [number, number];
    /** Firestore index */
    owner: string;
    type: TripType;
    notes?: string;
}

export const GfReact = {
    Heart: 'heart',
    Laugh: 'laugh',
    Wow: 'wow',
    Sad: 'sad',
    Angry: 'angry',
} as const;

export type GfReact = (typeof GfReact)[keyof typeof GfReact];

export const GF_REACT_EMOJI: Record<GfReact, string> = {
    heart: '❤️',
    laugh: '😂',
    wow: '😮',
    sad: '😢',
    angry: '😡',
};

export interface TimelineEvent {
    /** Firestore document ID — present for documents fetched from Firestore, absent for static data */
    id?: string;
    /** Firestore index */
    date: Date;
    name: string;
    des?: string;
    burstIcon?: string;
    /** Firestore index */
    owner: string;
    /** Note added by gf role — only editable by gf */
    gfNote?: string;
    /** Reaction emoji chosen by gf — stored as GfReact enum string in Firestore */
    gfReact?: GfReact;
}

export interface TimelineYear {
    description: string;
    events: TimelineEvent[];
}
