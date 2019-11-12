import axios from 'axios'
import {
    FETCH_USER,
    CHAT_USER
} from '../../config/types'
import { BASE_URL } from '../../config/config'
import {ChatManager, TokenProvider} from '@pusher/chatkit-client'
import q from 'q'

let getChatToken = (dispatch, user) => {
    console.log(user);
    if (user) {
        const chatManager = new ChatManager({
            instanceLocator: 'v1:us1:a773deea-0f08-4e46-b998-b3c1f49ce31d',
            userId: user.id,
            tokenProvider: new TokenProvider(
                {
                    url: `${BASE_URL}/chat/authenticate`,
                })
        })
        chatManager
            .connect()
            .then(currentUser => {
                console.log("current users rooms", currentUser.rooms);
                // need to subscribe to all the rooms before room.users property can be accessed
                return q.all(currentUser.rooms.map(room => currentUser.subscribeToRoom({ roomId: room.id })))
                    .then(() => dispatch({ type: CHAT_USER, payload: currentUser }));
            }).catch(error => console.error('error', error))
    }
}

export const fetchUser = () => async (dispatch) => {
    try {
        let res = await axios.get(`${BASE_URL}/api/v1/current_user`, { withCredentials: true })
        dispatch({ type: FETCH_USER, payload: res.data.Item });
        getChatToken(dispatch, res.data.Item);
    } catch (err) {
        dispatch({ type: FETCH_USER, payload: false });
    }
};


export const showLoginModal = () => {
    return { type: "SHOW_LOGIN_MODAL", payload: { showModal: true } };
};

