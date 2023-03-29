import { applyMiddleware, legacy_createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from '_reducers';

const isDevMode = process.env.NODE_ENV === 'development';

const composeEnhancers = (isDevMode && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
const store = legacy_createStore(reducers, composeEnhancers(applyMiddleware(thunk)));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
