import { ACTIONS } from './actions';
import uuid from "uuid";
import moment from "moment";
import items from "./inventory";

const initialState = {
    popup: false,
    level: 100,
    coins: 150,
    xp: 2000,
    inventory: items,
    furnaceQueue: [],
    anvilQueue: [],
    premium: 0,
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
        case 'craft':
        {
            let newInventory = checkAndRemoveIngredientsInInventory(state, action.item, action.count);
            if (newInventory) {
                let newCraftingQueue = [...state.furnaceQueue];
                newCraftingQueue.push({
                    image: action.item.image,
                    count: action.count,
                    product: action.item.name,
                    time: [action.item.constructionTime[0] * action.count, action.item.constructionTime[1]],
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
            let newXp = state.xp + (state.inventory.find(i => i.name === action.item.product).baseValue * action.item.count);
            let newLevel = Math.ceil(0.1 * Math.sqrt(newXp));
            if (newLevel > state.level) {
                //Do Level up stuff here...
            }
            newInventory.find(inventoryItem => inventoryItem.name === action.item.product).count += action.item.count;
            return {
                ...state,
                level: newLevel,
                xp: newXp,
                inventory: newInventory,
                furnaceQueue: newCraftingQueue,
            }
        }
        case 'resetInventory': {
            const newInventory = [...state.inventory];
            newInventory.find(i => i.name === 'Copper ore').count = 10;
            newInventory.find(i => i.name === 'Tin ore').count = 10;
            newInventory.find(i => i.name === 'Iron ore').count = 10;
            newInventory.find(i => i.name === 'Coal').count = 20;
            return {
                ...state,
                inventory: newInventory
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
