import { IEvent } from "./IEvent";


export interface UserState {
    userName: string;
    token: string;
    role: string,
}

export interface EventsState {
    events: IEvent[];
    myEvents: IEvent[];
}

export type ReduxState = {
    user: UserState;
    events: EventsState;
};
