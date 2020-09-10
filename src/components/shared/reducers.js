import uuid from "uuid"
import { toast } from "react-toastify"
import _ from "lodash"
import { ACTIONS } from "./actions"
import items, { ITEM_STATE } from "./inventory"
import traderstock from "./traderstock"
import allTraders from "./traders"
import visitorTypes from "./visitorTypes"

export const TIERS = [
  { name: "BRONZE", value: 1 },
  { name: "IRON", value: 2 },
  { name: "STEEL", value: 3 },
  { name: "MITHRIL", value: 4 },
  { name: "ADAMANT", value: 5 },
  { name: "RUNE", value: 6 },
  { name: "DRAGON", value: 7 },
  { name: "SILVER", value: 8 },
  { name: "GOLD", value: 9 },
  { name: "PREMIUM", value: 10 },
  { name: "NONE", value: 11 },
]

export const STATES = [
  { name: "NORMAL", value: 1 },
  { name: "UNFINISHED", value: 2 },
  { name: "RED", value: 3 },
  { name: "BLUE", value: 4 },
  { name: "GREEN", value: 5 },
  { name: "WHITE", value: 6 },
  { name: "BLACK", value: 7 },
  { name: "PURPLE", value: 8 },
  { name: "YELLOW", value: 9 },
  { name: "ENCHANTED_MIN", value: 3 },
  { name: "ENCHANTED_MAX", value: 9 },
]

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
  traderstock,
  visitorTypes,
  visitors: [
    {
      visitorType: visitorTypes.find((vt) => vt.visitorID === 33),
      visitorDemands: [
        {
          type: "type",
          value: "ore",
          quantityProvided: 0,
          quantity: 2,
          required: true,
          id: 1,
        },
        {
          type: "state",
          value: 2,
          quantityProvided: 0,
          quantity: 2,
          required: true,
          id: 2,
        },
        {
          type: "state",
          value: 1,
          quantityProvided: 0,
          quantity: 2,
          required: true,
          id: 3,
        },
        {
          type: "type",
          value: "food",
          quantityProvided: 0,
          quantity: 1,
          required: false,
          id: 4,
        },
      ],
    },
  ],
  visitorStats: [
    {
      visitorID: 33,
      typeDiscovered: true,
      tierDiscovered: true,
      visits: 0,
    },
  ],
  maximumVisitors: 3,
}

initialState.inventory.find((i) => i.name === "Copper ore").count[1] = 10
initialState.inventory.find((i) => i.name === "Tin ore").count[1] = 10
initialState.inventory.find((i) => i.name === "Iron ore").count[1] = 10
initialState.inventory.find((i) => i.name === "Coal").count[1] = 20

const getRandomTrader = (traders, level, traderstock, inventory) => {
  const random = Math.random() * 100
  const potentialTraders = allTraders
    .filter((tr) => traders.fixed.map((t) => t.id).indexOf(tr.id))
    .filter((tr) => traders.regular.map((t) => t.id).indexOf(tr.id))
    .filter((tr) => tr.level <= level)
    .filter((tr) => tr.weighting <= random)
  const randomTrader = _.shuffle(potentialTraders)[0]
  if (randomTrader) {
    return randomTrader
  }
  return null
}

function checkAndRemoveIngredientsInInventory(state, item, count, itemState) {
  if (item.level > state.level) {
    return null
  }
  for (let i = 0; i < item.ingredients.length; i++) {
    const ingredientItem = item.ingredients[i]
    const inventoryItem = state.inventory.find(
      (p) => p.name === ingredientItem.name
    )
    if (ingredientItem.itemState !== itemState) {
      continue
    }
    if (
      ingredientItem.ingredientState in inventoryItem.count &&
      inventoryItem.count[ingredientItem.ingredientState] >=
        ingredientItem.count * count
    ) {
      inventoryItem.count[ingredientItem.ingredientState] -=
        ingredientItem.count * count
    } else {
      return null
    }
  }
  return state.inventory
}

function getQueue(action, state) {
  let queue = []
  switch (action.queue) {
    case "furnace":
      queue = [...state.furnaceQueue]
      break
    case "anvil":
      queue = [...state.anvilQueue]
      break
    case "table":
      queue = [...state.tableQueue]
      break
    case "inventory":
      queue = [...state.inventoryQueue]
      break
    case "market":
      queue = [...state.marketQueue]
      break
    default:
  }
  return queue
}

function rootReducer(state = initialState, action) {
  try {
    switch (action.type) {
      case "craft": {
        const queue = getQueue(action, state)
        const newInventory = checkAndRemoveIngredientsInInventory(
          state,
          action.item,
          action.count,
          action.itemState
        )
        if (newInventory) {
          const newCraftingQueue = queue
          newCraftingQueue.push({
            image: action.item.image,
            count: action.count,
            product: action.item.name,
            state: action.itemState,
            time: [
              action.item.constructionTime[0] * action.count,
              action.item.constructionTime[1],
            ],
            uuid: uuid.v4(),
          })
          const newState = {
            ...state,
            inventory: newInventory,
            [`${action.queue}Queue`]: newCraftingQueue,
          }
          return newState
        }
        toast.error("You do not have the required ingredients")

        return state
      }
      case "updateFinishTime": {
        const queue = getQueue(action, state)
        const newCraftingQueue = queue
        newCraftingQueue.find((a) => a.uuid === action.uuid).finishTime =
          action.finishTime
        return {
          ...state,
          [`${action.queue}Queue`]: newCraftingQueue,
        }
      }
      case "removeDeleted": {
        const queue = getQueue(action, state)
        const newCraftingQueue = queue.filter((i) => !i.removeMe)
        return {
          ...state,
          [`${action.queue}Queue`]: newCraftingQueue,
        }
      }
      case "addInventoryAndRemoveFromQueue": {
        const queue = getQueue(action, state)
        const isInventory = action.queue === "inventory"

        const newCraftingQueue = [...queue]
        newCraftingQueue.forEach((i) => {
          if (i.uuid === action.item.uuid) i.removeMe = true
        })
        const newInventory = [...state.inventory]
        let newXp = state.xp
        if (!isInventory) {
          newXp =
            state.xp +
            state.inventory.find((i) => i.name === action.item.product)
              .baseValue *
              action.item.count
        }
        const newLevel = Math.ceil(0.1 * Math.sqrt(newXp))
        if (newLevel > state.level) {
          // Do Level up stuff here...
        }
        if (!isInventory) {
          const updatedInventoryItem = newInventory.find(
            (inventoryItem) => inventoryItem.name === action.item.product
          )
          if (!(action.item.state in updatedInventoryItem.count)) {
            updatedInventoryItem.count[action.item.state] = 0
          }
          updatedInventoryItem.count[action.item.state] += action.item.count
        }
        let newGold = state.gold
        if (isInventory) {
          const soldInventoryItem = newInventory.find(
            (inventoryItem) => inventoryItem.name === action.item.product
          )
          const goldMade = soldInventoryItem.baseValue * action.item.count
          newGold += goldMade
        }
        const newState = {
          ...state,
          level: newLevel,
          xp: newXp,
          inventory: newInventory,
          gold: newGold,
          [`${action.queue}Queue`]: newCraftingQueue,
        }
        return newState
      }
      case "resetInventory": {
        const newInventory = [...state.inventory]
        newInventory.find((i) => i.name === "Copper ore").count[
          ITEM_STATE.NORMAL
        ] = 10
        newInventory.find((i) => i.name === "Tin ore").count[
          ITEM_STATE.NORMAL
        ] = 10
        newInventory.find((i) => i.name === "Iron ore").count[
          ITEM_STATE.NORMAL
        ] = 10
        newInventory.find((i) => i.name === "Mithril ore").count[
          ITEM_STATE.NORMAL
        ] = 10
        newInventory.find((i) => i.name === "Coal").count[
          ITEM_STATE.NORMAL
        ] = 20
        newInventory.find((i) => i.name === "Spidersilk").count[
          ITEM_STATE.NORMAL
        ] = 20
        newInventory.find((i) => i.name === "Silk").count[
          ITEM_STATE.NORMAL
        ] = 20
        newInventory.find((i) => i.name === "Ruby").count[
          ITEM_STATE.NORMAL
        ] = 20
        newInventory.find((i) => i.name === "Cheese").count[
          ITEM_STATE.NORMAL
        ] = 20
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
          visitor: action.visitor,
          visitorDemand: action.visitorDemand,
        }
      }
      case "sell": {
        const count =
          action.count > 0
            ? action.count
            : state.inventory.find((i) => i.id === action.item.id).count[
                action.itemState
              ]
        console.log(
          `Selling ${count} ${action.item.name} (${action.item.id}) (${
            state.traderstock.find((ts) => ts.item === action.item.id).item
          })`
        )
        const newInventory = [...state.inventory]
        const newInventoryItem = newInventory.find(
          (i) => i.name === action.item.name
        )
        if (
          action.itemState in newInventoryItem.count &&
          newInventoryItem.count[action.itemState] >= count
        ) {
          newInventoryItem.count[action.itemState] -= count
        }
        const newInventoryQueue = [...state.inventoryQueue]
        newInventoryQueue.push({
          image: "coins.png",
          count,
          product: action.item.name,
          state: action.itemState,
          time: [
            action.item.constructionTime[0] * count,
            action.item.constructionTime[1],
          ],
          uuid: uuid.v4(),
        })
        return {
          ...state,
          inventory: newInventory,
          inventoryQueue: newInventoryQueue,
        }
      }
      case "removeSoldOutTraders": {
        const newRegularTraders = [...state.traders.regular].filter((t) => {
          const tradersStock = state.traderstock.filter(
            (s) =>
              s.trader === t.id &&
              s.purchases < s.maxStock &&
              s.requiredPurchases <= (state.trades[t.id] || 0)
          )
          return tradersStock.length > 0
        })
        return {
          ...state,
          traders: {
            ...state.traders,
            regular: newRegularTraders,
          },
        }
      }
      case "addTrader": {
        const newRegularTraders = [...state.traders.regular]
        newRegularTraders.push(action.trader)
        return {
          ...state,
          traders: {
            ...state.traders,
            regular: newRegularTraders,
          },
        }
      }
      case "resetStock": {
        const newTraderStock = [...state.traderstock]
        newTraderStock.forEach((ts) => {
          ts.stock = ts.maxStock
        })
        return {
          ...state,
          traderstock: newTraderStock,
        }
      }
      case "checkAndAddTraders": {
        const newTraders = { ...state.traders }
        let countAdding = 0
        while (
          countAdding++ < 10 &&
          newTraders.regular.length < state.traderCount
        ) {
          const randomTrader = getRandomTrader(
            newTraders,
            state.level,
            state.traderstock,
            state.inventory
          )
          if (randomTrader) {
            newTraders.regular.push(randomTrader)
          }
        }
        return {
          ...state,
          traders: newTraders,
        }
      }
      case "buy": {
        const newGold = state.gold - action.item.baseValue
        const newMarketQueue = [...state.marketQueue]
        const newTrades = { ...state.trades }
        newMarketQueue.push({
          image: action.item.image,
          count: action.count,
          product: action.item.name,
          traderId: action.traderId,
          state: ITEM_STATE.NORMAL,
          time: [
            action.item.constructionTime[0] * action.count,
            action.item.constructionTime[1],
          ],
          uuid: uuid.v4(),
        })
        const newStock = [...state.traderstock]
        const newTraderStock = newStock.find(
          (s) =>
            s.trader === action.stock.trader &&
            s.item === action.stock.item &&
            s.requiredPurchases === action.stock.requiredPurchases
        )
        if (newTraderStock) {
          newTraderStock.purchases =
            (newTraderStock.purchases || 0) + action.count
          newTraderStock.stock -= action.count
        }
        newTrades[action.traderId] =
          (newTrades[action.traderId] || 0) + action.count
        return {
          ...state,
          gold: newGold,
          marketQueue: newMarketQueue,
          traderstock: newStock,
          trades: newTrades,
        }
      }
      case "restockTrader": {
        const { trader } = action
        const newTraderStock = [...state.traderstock]
        let totalCost = 0
        newTraderStock.forEach((ts) => {
          if (
            ts.trader === trader.id &&
            (state.trades[trader.id] >= ts.requiredPurchases ||
              ts.requiredPurchases === 0)
          ) {
            const item = state.inventory.find((i) => i.id === ts.item)
            totalCost += (ts.maxStock - ts.stock) * item.baseValue
            ts.stock = ts.maxStock
          }
        })
        const newGold = state.gold - totalCost
        return {
          ...state,
          traderstock: newTraderStock,
          gold: newGold,
        }
      }
      case "buyAll": {
        const { trader } = action
        const newTraderStock = [...state.traderstock]
        let totalCost = 0
        const newTrades = { ...state.trades }
        const newMarketQueue = [...state.marketQueue]
        newTraderStock.forEach((ts) => {
          if (
            ts.trader === trader.id &&
            (state.trades[trader.id] >= ts.requiredPurchases ||
              ts.requiredPurchases === 0)
          ) {
            const item = state.inventory.find((i) => i.id === ts.item)

            for (let i = 0; i < ts.stock; i++) {
              newMarketQueue.push({
                image: item.image,
                count: 1,
                product: item.name,
                traderId: trader.id,
                state: ITEM_STATE.NORMAL,
                time: [item.constructionTime[0], item.constructionTime[1]],
                uuid: uuid.v4(),
              })
            }

            totalCost += (ts.maxStock - ts.stock) * item.baseValue
            ts.stock = 0
            if (!newTrades[trader.id]) {
              newTrades[trader.id] = 0
            }
            newTrades[trader.id] += ts.maxStock - ts.stock
          }
        })
        const newGold = state.gold - totalCost
        return {
          ...state,
          traderstock: newTraderStock,
          gold: newGold,
          trades: newTrades,
          marketQueue: newMarketQueue,
        }
      }
      case "lock": {
        const newTraders = { ...state.traders }
        const locked = newTraders.fixed.find((tr) => tr.id === action.trader.id)
        if (!locked) {
          newTraders.fixed.push(action.trader)
          newTraders.regular = newTraders.regular.filter(
            (t) => t.id !== action.trader.id
          )
        } else {
          newTraders.regular.push(action.trader)
          newTraders.fixed = newTraders.fixed.filter(
            (t) => t.id !== action.trader.id
          )
        }
        return {
          ...state,
          traders: newTraders,
        }
      }
      case "sellToVisitor": {
        const newStats = [...state.visitorStats]
        const stats = newStats.find((vs) => vs.visitorID === action.visitorID)
        stats.visits += 1
        stats.bestDiscovered = true
        if (action.saleValue > stats?.best?.value) {
          stats.best = {
            value: action.saleValue,
            item: action.saleItem,
            itemType: action.saleItemType,
            itemTier: action.saleItemTier,
            itemState: action.saleItemState,
          }
        }
        const newInventory = [...state.inventory]
        const inventoryItem = newInventory.find((i) => i.id === action.saleItem)
        console.log("InventoryItem: ", inventoryItem)
        inventoryItem.count[action.saleItemState] =
          inventoryItem.count[action.saleItemState] - 1
        const newGold = state.gold + action.saleValue
        const newVisitors = [...state.visitors]
        const visitor = newVisitors.find(
          (v) => v.visitorType.visitorID === action.visitorID
        )
        const newDemand = visitor.visitorDemands.find(
          (vd) =>
            vd.type === action.saleItemType && vd.value === action.saleItemValue
        )
        console.log("Demand: ", newDemand)
        newDemand.quantityProvided += 1
        const newState = {
          ...state,
          visitors: newVisitors,
          visitorStats: newStats,
          inventory: newInventory,
          gold: newGold,
        }
        console.log("New State: ", newState)
        return newState
      }
      case "addGold": {
        return {
          ...state,
          gold: state.gold + 100,
        }
      }
      default: {
        return state
      }
    }
  } catch (e) {
    console.error(e)
    return state
  }
}

export default rootReducer
