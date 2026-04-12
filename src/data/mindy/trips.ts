import type { Trip } from '@/types';

export const trips: Trip[] = [
    {
        name: 'Kelso và mái nhà xưa của em',
        flag: '🇨🇦',
        startDate: new Date('2025-11-01T00:00:00'),
        endDate: new Date('2025-11-01T00:00:00'),
        highlights: [],
        destinations: [
            {
                name: 'Kelso Conservation Area',
                googleMapLink:
                    'https://google.com/maps/place/Kelso+Conservation+Area/data=!4m2!3m1!1s0x0:0x56d75ac4d5609c57?sa=X&ved=1t:2428&ictx=111',
            },
            {
                name: 'Square One Missisauga',
                googleMapLink:
                    'https://google.com/maps/search/square+one/@43.5930011,-79.6424732,17z?entry=s&sa=X&ved=1t%3A199789',
            },
        ],
        owner: 'mindy',
    },
];
