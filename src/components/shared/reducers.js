import { ACTIONS } from './actions';
import { combineReducers } from 'redux';

import furnaceReducer from '../Furnace/reducers';

const initialState = {
    popup: false,
    level: 1,
    coins: 150,
    xp: 0,
    inventory: [
        {
            type: 'ore',
            name: 'Copper ore',
            image: 'copperOre.png',
            count: 10,
            level: 1,
        },
        {
            type: 'ore',
            name: 'Tin ore',
            image: 'tinOre.png',
            count: 10,
            level: 1,
        },
        {
            type: 'ore',
            name: 'Iron ore',
            image: 'ironOre.png',
            count: 10,
            level: 1,
        },
        {
            type: 'bar',
            name: 'Bronze bar',
            image: 'bronzeBar.png',
            description: 'A fresh bar of bronze.',
            count: 0,
            level: 1,
            time: [10, 'seconds'],
            ingredients: [
                {
                    type: 'ore',
                    image: 'copperOre.png',
                    name: 'Copper ore',
                    count: 1
                },
                {
                    type: 'ore',
                    image: 'tinOre.png',
                    name: 'Tin ore',
                    count: 1
                },
            ]
        },
        {
            type: 'bar',
            name: 'Iron bar',
            image: 'ironBar.png',
            description: 'A fresh bar of iron.',
            count: 0,
            level: 5,
            time: [20, 'seconds'],
            ingredients: [
                {
                    type: 'ore',
                    name: 'Iron ore',
                    image: 'ironOre.png',
                    count: 2
                },
            ]
        }
    ]
};

function rootReducer(state = initialState, action) {
    if (action.type === ACTIONS.POPUP) {
        return {
            ...state,
            popup: action.popup
        }
    }
    return state;
}

export default combineReducers({
    root: rootReducer,
    furnace: furnaceReducer
});
