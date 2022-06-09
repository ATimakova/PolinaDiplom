
import { EventsActionTypes, SET_EVENTS, SET_MY_EVENTS } from "../types/actionTypes";
import { EventsState } from "../types/types";

export const EventsInitialState: EventsState = {
    events: [],
    myEvents: []
};

export function EventsReduser(state = EventsInitialState, action: EventsActionTypes): EventsState {
    switch (action.type) {
        case SET_EVENTS:
            return Object.assign({}, state, {
                events: action.events,
            });
        case SET_MY_EVENTS:
            return Object.assign({}, state, {
                myEvents: action.myEvents,
            });
        default:
            return state;
    }
}
