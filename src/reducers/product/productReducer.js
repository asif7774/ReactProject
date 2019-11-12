import {
    // ALL_PRODUCTS,
    RECOMMENDED_PRODUCTS
} from '../../config/types'

export default function (state = [], action) {
    switch (action.type) {
        // case ALL_PRODUCTS:
        //     return action.payload;
        case RECOMMENDED_PRODUCTS:
            return { ...state, recommended: action.payload }
        default:
            return state;
    }

}