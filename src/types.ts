export interface ImageFile {
    file: string;
    label: string;
}

export interface Icon {
    symbol: string;
    color: string;
    label: string;
}

export interface TripDestination {
    name: string;
    googleMapLink?: string;
}

export interface Trip {
    name: string;
    flag: string;
    /** Firestore index */
    startDate: Date;
    /** Firestore index */
    endDate: Date;
    highlights: string[];
    destinations: TripDestination[];
    /** Firestore index */
    owner: string;
}

export interface TimelineEvent {
    /** Firestore document ID — present for documents fetched from Firestore, absent for static data */
    id?: string;
    /** Firestore index */
    date: Date;
    name: string;
    des?: string | string[];
    burstIcon?: string;
    /** Firestore index */
    owner: string;
}

export interface TimelineYear {
    description: string;
    events: TimelineEvent[];
}
