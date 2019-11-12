import { FOLLOWED_PRODUCTS, UPDATE_USERINFO_COLLECTION, USERINFO } from '../../config/types'

export default function (state = { userInfoCollection: [] }, action) {
    switch (action.type) {
        case FOLLOWED_PRODUCTS:
            return { ...state, followedProducts: action.payload }
        case 'PROFILE_FEED':
            return { ...state, profile_feed: action.payload }
        case 'NETWORK_FEED':
            return { ...state, network_feed: action.payload }
        case "USER_PROFILE_INFO":
            return { ...state, userProfileInfo: action.payload }
        case USERINFO:
            let userInfoCollection = state.userInfoCollection.slice();
            userInfoCollection.push(action.payload);
            return { ...state, userInfoCollection }
        case UPDATE_USERINFO_COLLECTION:
            return { ...state, userInfoCollection: action.payload }
        default:
            return state;
    }

}