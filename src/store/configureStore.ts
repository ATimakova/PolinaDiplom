import thunk from "redux-thunk";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { UserInitialState, UserReduser} from "../reducer/UserReduser";
import { EventsInitialState, EventsReduser } from "../reducer/EventsReducer";

export const initialState = {
    events: EventsInitialState,
    user: UserInitialState,
};

export const startReducers = {
    events: EventsReduser,
    user: UserReduser,
};

export default function configureStore() {
    const reducers = startReducers;

    const middleware = [thunk];
    // @ts-ignore
    const composeEnhancers =
        typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
            ? // @ts-ignore
              window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
            : compose;

    const rootReducer = combineReducers({
        ...reducers,
    });

    // @ts-ignore
    return createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(...middleware)));
}
