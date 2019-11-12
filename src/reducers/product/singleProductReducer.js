import {
    SINGLE_PRODUCT_INFO,
    SINGLE_PRODUCT_SUPPLIER,
    SINGLE_PRODUCT_ACTIVITY,
    SINGLE_PRODUCT_APPLICATION,
    SINGLE_PRODUCT_RAW_MATERIALS,
    POTENTIAL_CUSTOMERS
} from '../../config/types'

export default function (state = {}, action) {
    switch (action.type) {
        case SINGLE_PRODUCT_INFO:
            return { ...state, info: action.payload };
        case SINGLE_PRODUCT_ACTIVITY:
            return { ...state, activity: action.payload };
        case SINGLE_PRODUCT_SUPPLIER:
            return { ...state, supplier: action.payload };
        case SINGLE_PRODUCT_APPLICATION:
            return { ...state, application: action.payload };
        case SINGLE_PRODUCT_RAW_MATERIALS:
            return { ...state, raw: action.payload };
        case POTENTIAL_CUSTOMERS:
            return {...state, customer: action.payload}
        default:
            return state;
    }

}