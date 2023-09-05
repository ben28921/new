import {
    SHOW_LOADING,
    HIDE_LOADING,
    EMAIL_REQUESTED,
    LOGGED_IN,
    LOGOUT
} from "../../utils/constants/settings";

export const onShowLoading = () => {
    return dispatch => {
        dispatch({ type: SHOW_LOADING });
    }
};

export const onHideLoading = () => {
    return dispatch => {
        dispatch({ type: HIDE_LOADING });
    }
};

export const onEmailRequested = ( email ) => {
    return dispatch => {
        dispatch({ type: EMAIL_REQUESTED, email: email });
    }
}

export const onLoggedIn = ( token, refreshToken ) => {
    return dispatch => {
        dispatch({ type: LOGGED_IN, token: token, refreshToken: refreshToken });
    }
}

export const onLogout = () => {
    return dispatch => {
        dispatch({ type: LOGOUT });
    }
}