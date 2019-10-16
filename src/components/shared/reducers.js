import { ACTIONS } from './actions';
import uuid from "uuid";
import items, {ITEM_STATE} from "./inventory";
import traderstock from './traderstock';
import {toast} from "react-toastify";
import allTraders from "./traders";
import _ from "lodash";

const initialState = {
    popup: false,
    level: 1,
    coins: 150,
    xp: 1,
    gold: 100,
    inventory: items,
    furnaceQueue: [],
    anvilQueue: [],
    tableQueue: [],
    inventoryQueue: [],
    marketQueue: [],
    traders: {
        fixed: [],
        regular: [],
    },
    trades: {},
    traderCount: 3,
    premium: 0,
    traderstock: traderstock,
};

initialState.inventory.find(i => i.name === 'Copper ore').count[1] = 10;
initialState.inventory.find(i => i.name === 'Tin ore').count[1] = 10;
initialState.inventory.find(i => i.name === 'Iron ore').count[1] = 10;
initialState.inventory.find(i => i.name === 'Coal').count[1] = 20;

const getRandomTrader = (traders, level, traderstock, inventory) => {
    const random = Math.random() * 100;
    const potentialTraders = allTraders
        .filter(tr => traders.fixed.map(t => t.id).indexOf(tr.id))
        .filter(tr => traders.regular.map(t => t.id).indexOf(tr.id))
        .filter(tr => tr.level <= level)
        .filter(tr => tr.weighting <= random);
    let randomTrader = _.shuffle(potentialTraders)[0];
    if (randomTrader) {
        return randomTrader;
    } else {
        console.log('No Traders for: ', random, traders);
    }
    return null;
};

function checkAndRemoveIngredientsInInventory(state, item, count, itemState) {
    if (item.level > state.level) {
        return null;
    }
    for(let i = 0; i < item.ingredients.length; i++){
        const ingredientItem = item.ingredients[i];
        const inventoryItem = state.inventory.find(p => p.name === ingredientItem.name);
        if (ingredientItem.itemState !== itemState) {
            continue;
        }
        if ((ingredientItem.ingredientState in inventoryItem.count) && inventoryItem.count[ingredientItem.ingredientState] >= (ingredientItem.count * count)) {
            inventoryItem.count[ingredientItem.ingredientState] -= (ingredientItem.count * count);
        } else {
            return null;
        }
    }
    return state.inventory;
}

function getQueue(action, state) {
    let queue = [];
    switch (action.queue) {
        case 'furnace':
            queue = [...state.furnaceQueue];
            break;
        case 'anvil':
            queue = [...state.anvilQueue];
            break;
        case 'table':
            queue = [...state.tableQueue];
            break;
        case 'inventory':
            queue = [...state.inventoryQueue];
            break;
        case 'market':
            queue = [...state.marketQueue];
            break;
        default:
    }
    return queue;
}

function rootReducer(state = initialState, action) {
    try {
        switch (action.type) {
            case 'craft': {
                let queue = getQueue(action, state);
                let newInventory = checkAndRemoveIngredientsInInventory(state, action.item, action.count, action.itemState);
                if (newInventory) {
                    let newCraftingQueue = queue;
                    newCraftingQueue.push({
                        image: action.item.image,
                        count: action.count,
                        product: action.item.name,
                        state: action.itemState,
                        time: [action.item.constructionTime[0] * action.count, action.item.constructionTime[1]],
                        uuid: uuid.v4(),
                    })
                    let newState = {
                        ...state,
                        inventory: newInventory,
                        [action.queue + 'Queue']: newCraftingQueue,
                    };
                    return newState
                } else {
                    toast.error('You do not have the required ingredients');
                }
                return state;
            }
            case 'updateFinishTime': {
                let queue = getQueue(action, state);
                let newCraftingQueue = queue;
                newCraftingQueue.find(a => a.uuid === action.uuid).finishTime = action.finishTime;
                return {
                    ...state,
                    [action.queue + 'Queue']: newCraftingQueue,
                }
            }
            case 'removeDeleted': {
                let queue = getQueue(action, state);
                let newCraftingQueue = queue.filter(i => !i.removeMe);
                return {
                    ...state,
                    [action.queue + 'Queue']: newCraftingQueue,
                }
            }
            case 'addInventoryAndRemoveFromQueue': {
                console.log('addInventoryAndRemoveFromQueue', action);
                let queue = getQueue(action, state);
                const isInventory = action.queue === 'inventory';
                const isMarket = action.queue === 'market';

                let newCraftingQueue = [...queue];
                newCraftingQueue.forEach(i => {
                    if (i.uuid === action.item.uuid) i.removeMe = true
                });
                let newInventory = [...state.inventory];
                let newXp = state.xp;
                if (!isInventory) {
                    newXp = state.xp + (state.inventory.find(i => i.name === action.item.product).baseValue * action.item.count);
                }
                let newLevel = Math.ceil(0.1 * Math.sqrt(newXp));
                if (newLevel > state.level) {
                    //Do Level up stuff here...
                }
                if (!isInventory) {
                    let updatedInventoryItem = newInventory.find(inventoryItem => inventoryItem.name === action.item.product);
                    if (!(action.item.state in updatedInventoryItem.count)) {
                        updatedInventoryItem.count[action.item.state] = 0;
                    }
                    updatedInventoryItem.count[action.item.state] += action.item.count;
                }
                let newGold = state.gold;
                if (isInventory) {
                    const soldInventoryItem = newInventory.find(inventoryItem => inventoryItem.name === action.item.product);
                    const goldMade = (soldInventoryItem.baseValue * action.item.count)
                    newGold += goldMade;
                }
                let newState = {
                    ...state,
                    level: newLevel,
                    xp: newXp,
                    inventory: newInventory,
                    gold: newGold,
                    [action.queue + 'Queue']: newCraftingQueue,
                };
                return newState;
            }
            case 'resetInventory': {
                const newInventory = [...state.inventory];
                newInventory.find(i => i.name === 'Copper ore').count[ITEM_STATE.NORMAL] = 10;
                newInventory.find(i => i.name === 'Tin ore').count[ITEM_STATE.NORMAL] = 10;
                newInventory.find(i => i.name === 'Iron ore').count[ITEM_STATE.NORMAL] = 10;
                newInventory.find(i => i.name === 'Mithril ore').count[ITEM_STATE.NORMAL] = 10;
                newInventory.find(i => i.name === 'Coal').count[ITEM_STATE.NORMAL] = 20;
                newInventory.find(i => i.name === 'Spidersilk').count[ITEM_STATE.NORMAL] = 20;
                newInventory.find(i => i.name === 'Silk').count[ITEM_STATE.NORMAL] = 20;
                newInventory.find(i => i.name === 'Ruby').count[ITEM_STATE.NORMAL] = 20;
                newInventory.find(i => i.name === 'Cheese').count[ITEM_STATE.NORMAL] = 20;
                return {
                    ...state,
                    inventory: newInventory,
                    gold: 1000,
                }
            }
            case ACTIONS.POPUP: {
                return {
                    ...state,
                    popup: action.popup,
                    trader: action.trader,
                }
            }
            case 'sell': {
                const newInventory = [...state.inventory];
                const newInventoryItem = newInventory.find(i => i.name === action.item.name);
                if (action.itemState in newInventoryItem.count && newInventoryItem.count[action.itemState] >= action.count) {
                    newInventoryItem.count[action.itemState] -= action.count;
                }
                const newInventoryQueue = [...state.inventoryQueue];
                newInventoryQueue.push({
                    image: 'coins.png',
                    count: action.count,
                    product: action.item.name,
                    state: action.itemState,
                    time: [action.item.constructionTime[0] * action.count, action.item.constructionTime[1]],
                    uuid: uuid.v4(),
                })
                return {
                    ...state,
                    inventory: newInventory,
                    inventoryQueue: newInventoryQueue,
                }
            }
            case 'removeSoldOutTraders': {
                let newRegularTraders = [...state.traders.regular].filter(t => {
                    let tradersStock = state.traderstock.filter(s => s.trader === t.id && s.purchases < s.maxStock && s.requiredPurchases <= (state.trades[t.id] || 0));
                    return tradersStock.length > 0;
                });
                return {
                    ...state,
                    traders: {
                        ...state.traders,
                        regular: newRegularTraders,
                    }
                }
            }
            case 'addTrader': {
                const newRegularTraders = [...state.traders.regular];
                newRegularTraders.push(action.trader);
                return {
                    ...state,
                    traders: {
                        ...state.traders,
                        regular: newRegularTraders,
                    }
                }
            }
            case 'resetStock': {
                console.log('Reset Stock');
                const newTraderStock = [...state.traderstock];
                newTraderStock.forEach(ts => {
                    ts.stock = ts.maxStock;
                });
                return {
                    ...state,
                    traderstock: newTraderStock,
                }
            }
            case 'checkAndAddTraders': {
                let newTraders = {...state.traders};
                let countAdding = 0;
                while (countAdding++ < 10 && ((newTraders.fixed.length + newTraders.regular.length) < state.traderCount)) {
                    let randomTrader = getRandomTrader(newTraders, state.level, state.traderstock, state.inventory);
                    if (randomTrader) {
                        newTraders.regular.push(randomTrader);
                    }
                }
                return {
                    ...state,
                    traders: newTraders,
                }
            }
            case 'buy': {
                const newGold = state.gold - action.item.baseValue;
                const newMarketQueue = [...state.marketQueue];
                const newTrades = {...state.trades};
                newMarketQueue.push({
                    image: action.item.image,
                    count: action.count,
                    product: action.item.name,
                    traderId: action.traderId,
                    state: ITEM_STATE.NORMAL,
                    time: [action.item.constructionTime[0] * action.count, action.item.constructionTime[1]],
                    uuid: uuid.v4(),
                });
                const newStock = [...state.traderstock];
                const newTraderStock = newStock.find(s => s.trader === action.stock.trader && s.item === action.stock.item && s.requiredPurchases === action.stock.requiredPurchases)
                if (newTraderStock) {
                    newTraderStock.purchases = (newTraderStock.purchases || 0) + action.count;
                    newTraderStock.stock = newTraderStock.stock - action.count;
                    console.log('New Purchases: ', newTraderStock.purchases);
                }
                newTrades[action.traderId] = (newTrades[action.traderId] || 0) + action.count;
                return {
                    ...state,
                    gold: newGold,
                    marketQueue: newMarketQueue,
                    traderstock: newStock,
                    trades: newTrades,
                }
            }
            default: {
                return state;
            }
        }
    } catch(e) {
        return state;
    }
}

export default rootReducer;
