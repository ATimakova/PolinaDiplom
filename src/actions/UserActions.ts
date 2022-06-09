import {
    SET_ROLE,
    SET_TOKEN,
    SET_USER_NAME,
} from "../types/actionTypes";

export function setToken(token: string | undefined) {
    return {
        type: SET_TOKEN,
        token,
    };
}

export function setUserName(userName: string) {
    return {
        type: SET_USER_NAME,
        userName,
    };
}


export function setRole(role: string | undefined) {
    return {
        type: SET_ROLE,
        role,
    };
}
