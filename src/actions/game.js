import { getData, postData } from './index';
import {FETCH_DATA, DATA_ERROR} from './types';

export function fetchGameData(browser_id) {
    const url = `/get/${browser_id}`;
    return dispatch => getData(FETCH_DATA, DATA_ERROR, url, dispatch);
}

export function updateOrCreateGameData(gameData) {
    const url = `/save`;
    return dispatch => postData(FETCH_DATA, DATA_ERROR, url, dispatch, gameData);
}