import {
    SET_EVENTS,
    SET_MY_EVENTS,
} from "../types/actionTypes";
import { IEvent } from "../types/IEvent";

export function setEvents(events: IEvent[]) {
    return {
        type: SET_EVENTS,
        events,
    };
}

export function setMyEvents(myEvents: IEvent[]) {
    return {
        type: SET_MY_EVENTS,
        myEvents,
    };
}
