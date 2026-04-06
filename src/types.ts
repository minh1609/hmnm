export interface TripDestination {
    name: string;
    googleMapLink?: string;
}

export interface Trip {
    name: string;
    flag: string;
    startDate: Date;
    endDate: Date;
    highlights: string[];
    destinations: TripDestination[];
}

export interface TimelineEvent {
    date: Date;
    name: string;
    des?: string | string[];
    burstIcon?: string;
}

export interface TimelineYear {
    description: string;
    events: TimelineEvent[];
}
