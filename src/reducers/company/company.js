import {
    SINGLE_COMPANY_INFO
} from '../../config/types'

export default function (state = {}, action) {
    switch (action.type) {
        case SINGLE_COMPANY_INFO:
            return { ...state, info: action.payload };
        case "SHOW_LOGIN_MODAL":
            return { ...state, showLoginModal: action.payload };
        default:
            return state;
    }

}