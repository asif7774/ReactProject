import { CHAT_USER } from '../../config/types'

export default function (state = null, action) {
    switch (action.type) {
        case CHAT_USER:
            return action.payload || false;
        default:
            return state;
    }
}