import {
    SHOW_LOADING,
    HIDE_LOADING,
    LOGGED_IN,
    LOGOUT,
} from "../../utils/constants/settings";

const INIT_STATE = {
    showLoading: false,
    //token: "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ3YXluZSIsInR5cGUiOiJBQ0NFU1NfVE9LRU4iLCJleHAiOjE2Nzk5OTk3MDF9.e8G9p_ZgwTIFzBSodSkKqGgjnPMMhfFP3yV1Aeboz2w",
    token: typeof localStorage.getItem('token') === "string" && localStorage.getItem('token') !== "" ? localStorage.getItem('token') : undefined,
    refreshToken: typeof localStorage.getItem('refreshToken') === "string" && localStorage.getItem('refreshToken') !== "" ? localStorage.getItem('refreshToken') : undefined,
    email: undefined,
    nickname: undefined,
};

const reducerFunc = (state = INIT_STATE, action) => {
    switch (action.type) {

        case SHOW_LOADING: {
            return {
                ...state,
                showLoading: true
            }
        }

        case HIDE_LOADING: {
            return {
                ...state,
                showLoading: false
            }
        }
        
        case LOGGED_IN: {
            localStorage.setItem('token', action.token)
            localStorage.setItem('refreshToken', action.refreshToken)

            return {
                ...state,
                token: action.token,
                refreshToken: action.refreshToken
            }
        }

        case LOGOUT: {
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')

            return {
                ...state,
                token: undefined,
                refreshToken: undefined
            }
        }

        default: {
            return state;
        }
    }
};

export default reducerFunc;
