import { combineReducers } from 'redux';
import app from '_reducers/appReducer';

const reducer = combineReducers({
    app,
});
export default reducer;
