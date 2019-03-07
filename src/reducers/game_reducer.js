import {FETCH_DATA, DATA_ERROR} from '../actions/types';

const INITIAL_STATE = { game_data: {}, message: '', error: '' };

export default function (state = INITIAL_STATE, action) {

    switch (action.type) {
        case FETCH_DATA:
            return { ...state, game_data: action.payload.data };
        case DATA_ERROR:
            return { ...state, error: action.payload };
        default:
            return state;
    }
}