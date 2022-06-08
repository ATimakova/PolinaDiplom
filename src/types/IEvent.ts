import { Moment } from "moment";

export type IEvent = {
    id: number;
    name: string;
    date?: Date | Moment | string | null;
    description: string;
    lng: number;
    lat: number;
    type: EventType,
    price?: number
};


export enum EventType {
    EVENT = 'EVENT',
    ATTRACTION = 'ATTRACTION', 
    ADMINISTRATION = 'ADMINISTRATION',
    ACTIVITY = 'ACTIVITY'
}

export type IEventForm = {
    id?: number,
    name: string;
    eventDate?: Date | Moment | string | null;
    description: string;
    lng: number | null;
    lat: number | null;
    type: EventType,
    price?: number | null
};