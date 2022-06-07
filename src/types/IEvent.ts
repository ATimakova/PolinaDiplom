export type IEvent = {
    id: number;
    name: string;
    date?: Date | null;
    description: string;
    lng: number;
    lat: number;
    type: EventType,
    price?: number
};


export enum EventType {
    EVENT,
    ATTRACTION, 
    ADMINISTRATION,
    ACTIVITY
}

export type IEventForm = {
    name: string;
    date?: Date | null;
    description: string;
    lng: number;
    lat: number;
    type: EventType,
    price?: number
};