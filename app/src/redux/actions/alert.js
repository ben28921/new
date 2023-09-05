import {
    SHOW_ALERT,
    HIDE_ALERT
} from "../../utils/constants/alert";

export const onShowAlert = ( title, message ) => {
    return dispatch => {
        dispatch({ type: SHOW_ALERT, title: title, message: message });
    }
};

export const onHideAlert = () => {
    return dispatch => {
        dispatch({ type: HIDE_ALERT });
    }
};
