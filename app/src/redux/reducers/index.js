import { combineReducers } from 'redux';
import { createRouterReducer } from '@lagunovsky/redux-react-router';
import alert from "./alert"
import settings from "./settings"
import contactsApp from "./contactsApp"

const exportReducers = history => {
    return combineReducers({
        router: createRouterReducer(history),
        alert: alert,
        settings: settings,
        contactsApp: contactsApp
    });
};

export default exportReducers;
