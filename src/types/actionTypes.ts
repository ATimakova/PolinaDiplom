import { IEvent } from "./IEvent";


// Events
export const SET_EVENTS = "SET_EVENTS";
export const SET_MY_EVENTS = "SET_MY_EVENTS";

interface SetEvents {
    type: typeof SET_EVENTS;
    events: IEvent[];
}

interface SetMyEvents {
    type: typeof SET_MY_EVENTS;
    myEvents: IEvent[];
}

export type EventsActionTypes = SetEvents | SetMyEvents;

// User
export const SET_USER_NAME = "SET_USER_NAME";
export const SET_TOKEN = "SET_TOKEN";
export const SET_ROLE = "SET_ROLE";

interface SetUserName {
    type: typeof SET_USER_NAME;
    userName: string;
}

interface SetToken {
    type: typeof SET_TOKEN;
    token: string;
}


interface SetRole {
    type: typeof SET_ROLE;
    role: string;
}
export type UserActionTypes = SetToken | SetUserName | SetRole;
