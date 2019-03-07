import axios from 'axios';
export const API_URL = 'http://localhost:9001/api';


// Get Request
export function getData(action, errorType, url, dispatch) {
    const requestUrl = API_URL + url;
    let headers = {};

    axios.get(requestUrl, headers)
        .then((response) => {
            dispatch({
                type: action,
                payload: response.data,
            });
        })
        .catch((error) => {
            errorHandler(dispatch, error.response, errorType);
        });
}

// Post Request
export function postData(action, errorType, url, dispatch, data) {
    const requestUrl = API_URL + url;
    let headers = {};

    axios.post(requestUrl, data, headers)
        .then((response) => {
            dispatch({
                type: action,
                payload: response.data,
            });
        })
        .catch((error) => {
            errorHandler(dispatch, error.response, errorType);
        });
}


export function errorHandler(dispatch, error, type) {
    console.log('Error type: ', type);
    console.log(error);

    let errorMessage = error.response ? error.response.data : error;

    dispatch({
        type,
        payload: errorMessage,
    });
}