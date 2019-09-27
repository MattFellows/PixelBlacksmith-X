import { ACTIONS } from './actions';
import uuid from "uuid";
import moment from "moment";
import items from "./inventory";

const initialState = {
    popup: false,
    level: 1,
    coins: 150,
    xp: 0,
    inventory: items,
    furnaceQueue: [],
};

initialState.inventory.find(i => i.name === 'Copper ore').count = 10;
initialState.inventory.find(i => i.name === 'Tin ore').count = 10;
initialState.inventory.find(i => i.name === 'Iron ore').count = 10;
initialState.inventory.find(i => i.name === 'Coal').count = 20;

function checkAndRemoveIngredientsInInventory(state, item, count) {
    if (item.level > state.level) {
        return null;
    }
    for(let i = 0; i < item.ingredients.length; i++){
        const ingredientItem = item.ingredients[i];
        const inventoryItem = state.inventory.find(p => p.name === ingredientItem.name);
        if (inventoryItem && inventoryItem.count >= (ingredientItem.count * count)) {
            inventoryItem.count -= (ingredientItem.count * count);
        } else {
            return null;
        }
    }
    return state.inventory;
}

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case 'smelt':
        {
            console.log('Smelting: ', action.item);
            let newInventory = checkAndRemoveIngredientsInInventory(state, action.item, action.count);
            console.log('Actually smelting because there was enough in inventory: ', newInventory);
            if (newInventory) {
                let newCraftingQueue = [...state.furnaceQueue];
                newCraftingQueue.push({
                    image: action.item.image,
                    count: action.count,
                    product: action.item.name,
                    time: [action.item.time[0] * action.count, action.item.time[1]],
                    uuid: uuid.v4(),
                })
                return {
                    ...state,
                    inventory: newInventory,
                    furnaceQueue: newCraftingQueue,
                }
            }
            return state;
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
}

export default rootReducer;
