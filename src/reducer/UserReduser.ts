
import { SET_TOKEN, SET_USER_NAME, SET_ROLE, UserActionTypes } from "../types/actionTypes";
import { UserState } from "../types/types";

export const UserInitialState: UserState = {
    userName: "",
    token: "",
    role: ""
};

export function UserReduser(state = UserInitialState, action: UserActionTypes): UserState {
    switch (action.type) {
        case SET_USER_NAME:
            return Object.assign({}, state, {
                userName: action.userName,
            });
        case SET_TOKEN:
            return Object.assign({}, state, {
                token: action.token,
            });
        case SET_ROLE:
            return Object.assign({}, state, {
                role: action.role,
            });
        default:
            return state;
    }
}
