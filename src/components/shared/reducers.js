import { ACTIONS } from './actions';
import uuid from "uuid";
import moment from "moment";

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
    ],
    furnaceQueue: [],
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case 'smelt':
        {
            let newCraftingQueue = [...state.furnaceQueue];
            newCraftingQueue.push({
                image: action.image,
                count: action.count,
                product: action.product,
                time: [action.time[0] * action.count, action.time[1]],
                uuid: uuid.v4(),
            })
            return {
                ...state,
                furnaceQueue: newCraftingQueue,
            }
        }
        case 'updateFinishTime': {
            let newCraftingQueue = [...state.furnaceQueue];
            newCraftingQueue.find(a => a.uuid === action.uuid).finishTime = action.finishTime;
            return {
                ...state,
                furnaceQueue: newCraftingQueue,
            }
        }
        case 'removeDeleted': {
            let newCraftingQueue = [...state.furnaceQueue].filter(i => !i.removeMe).filter(i => moment(i.finishTime).isBefore(moment()) );
            return {
                ...state,
                furnaceQueue: newCraftingQueue,
            }
        }
        case 'addInventoryAndRemoveFromQueue': {
            let newCraftingQueue = [...state.furnaceQueue].filter(i => i.uuid !== action.item.uuid);
            let newInventory = [...state.inventory];
            newInventory.find(inventoryItem => inventoryItem.name === action.item.product).count += action.item.count;
            console.log('Added: ',newInventory);
            return {
                ...state,
                inventory: newInventory,
                furnaceQueue: newCraftingQueue,
            }
        }
        case ACTIONS.POPUP: {
            return {
                ...state,
                popup: action.popup
            }
        }
        default: {
            return state;
        }
    }
    return state;
}

export default rootReducer;
