import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import gameReducer from './game_reducer';

export default combineReducers({
    form: formReducer,
    game: gameReducer
})