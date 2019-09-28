import { ACTIONS } from './actions';
import uuid from "uuid";
import moment from "moment";
import items from "./inventory";
import {toast} from "react-toastify";

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

function checkAndRemoveIngredientsInInventory(state, item, count, itemState) {
    if (item.level > state.level) {
        return null;
    }
    for(let i = 0; i < item.ingredients.length; i++){
        const ingredientItem = item.ingredients[i];
        const inventoryItem = state.inventory.find(p => p.name === ingredientItem.name);
        if (ingredientItem.state !== itemState) {
            continue;
        }
        console.log('Check: ', ingredientItem.name, ' x ', ingredientItem.count);
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
            let queue = [];
            switch (action.queue) {
                case 'furnace':
                    queue = [...state.furnaceQueue];
                    break;
                case 'anvil':
                    queue = [...state.anvilQueue];
                    break;
                default:
            }
            let newInventory = checkAndRemoveIngredientsInInventory(state, action.item, action.count, action.itemState);
            if (newInventory) {
                let newCraftingQueue = queue;
                newCraftingQueue.push({
                    image: action.item.image,
                    count: action.count,
                    product: action.item.name,
                    time: [action.item.constructionTime[0] * action.count, action.item.constructionTime[1]],
                    uuid: uuid.v4(),
                })
                let newState = {
                    ...state,
                    inventory: newInventory,
                    [action.queue + 'Queue']: newCraftingQueue,
                };
                console.log('New State:', newState);
                return newState
            } else {
                console.log('About to toast');
                toast.error('You do not have the required ingredients');
            }
            return state;
        }
        case 'updateFinishTime': {
            let queue = [];
            switch (action.queue) {
                case 'furnace':
                    queue = [...state.furnaceQueue];
                    break;
                case 'anvil':
                    queue = [...state.anvilQueue];
                    break;
                default:
            }
            let newCraftingQueue = queue;
            console.log('Finding stack with uuid: ', action.uuid, ' in: ', newCraftingQueue);
            newCraftingQueue.find(a => a.uuid === action.uuid).finishTime = action.finishTime;
            return {
                ...state,
                [action.queue + 'Queue']: newCraftingQueue,
            }
        }
        case 'removeDeleted': {
            let queue = [];
            switch (action.queue) {
                case 'furnace':
                    queue = [...state.furnaceQueue];
                    break;
                case 'anvil':
                    queue = [...state.anvilQueue];
                    break;
                default:
            }
            let newCraftingQueue = queue.filter(i => !i.removeMe).filter(i => moment(i.finishTime).isBefore(moment()) );
            return {
                ...state,
                [action.queue + 'Queue']: newCraftingQueue,
            }
        }
        case 'addInventoryAndRemoveFromQueue': {
            let queue = [];
            switch (action.queue) {
                case 'furnace':
                    queue = [...state.furnaceQueue];
                    break;
                case 'anvil':
                    queue = [...state.anvilQueue];
                    break;
                default:
            }
            let newCraftingQueue = queue.filter(i => i.uuid !== action.item.uuid);
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
                [action.queue + 'Queue']: newCraftingQueue,
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
