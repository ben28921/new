import {
    SHOW_ALERT,
    HIDE_ALERT
} from "../../utils/constants/alert";

const INIT_STATE = {
    open: false,
    title: "",
    message: ""
};

const reducerFunc = (state = INIT_STATE, action) => {
    switch (action.type) {
        case SHOW_ALERT: {
            return {
                ...state,
                open: true,
                title: action.title,
                message: action.message
            }
        }

        case HIDE_ALERT: {
            return {
                ...state,
                open: false
            }
        }

        default: {
            return state;
        }
    }
};

export default reducerFunc;
