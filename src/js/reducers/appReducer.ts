import { AnyAction } from 'redux';
import * as TYPES from '_actions/actionTypes';

export const initialState = {};

export default function AccountReducer(state = initialState, action: AnyAction) {
    switch (action.type) {
        default: {
            return null;
        }
    }
    return state;
}
