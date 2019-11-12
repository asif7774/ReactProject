import { combineReducers } from 'redux'
import { reducer as formReducer} from 'redux-form'

import authReducer from './auth/authReducer'
import chatReducer from './auth/chatReducer'
import productReducer from './product/productReducer'
import companyReducer from './company/company'
import singleProductReducer from './product/singleProductReducer'
import userReducer from './user/userReducer'
import networkFeedReducer from './networkFeed/networkFeed';

export default combineReducers({
    auth: authReducer,
    product: productReducer,
    singleProduct: singleProductReducer,
    form: formReducer,
    user: userReducer,
    chatUser: chatReducer,
    singleCompany: companyReducer,
    networkFeed: networkFeedReducer
})
