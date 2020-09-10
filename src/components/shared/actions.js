export const ACTIONS = {
  POPUP: "POPUP",
  sellToVisitor: "sellToVisitor",
}

export const setPopup = ({ popupType, trader, visitor, visitorDemand }) => {
  const action = {
    type: ACTIONS.POPUP,
    popup: popupType,
    trader,
    visitor,
    visitorDemand,
  }
  return action
}

const getMultiplier = (visitor, item, state) => {
  const typeMultiplier =
    item.type === visitor.visitorType.typePreferred.name
      ? visitor.visitorType.typeMultiplier
      : 1
  const stateMultiplier =
    state === visitor.visitorType.statePreferred.value
      ? visitor.visitorType.stateMultiplier
      : 1
  const tierMultiplier =
    item.tier === visitor.visitorType.tierPreferred.value
      ? visitor.visitorType.tierMultiplier
      : 1
  return typeMultiplier * stateMultiplier * tierMultiplier
}

export const sellToVisitor = ({ visitor, visitorDemand, item, state }) => {
  const action = {}
  action.visitorID = visitor.visitorType.visitorID
  action.saleValue = Math.round(
    item.baseValue * getMultiplier(visitor, item, state)
  )
  action.saleItem = item.id
  action.saleItemType = visitorDemand.type
  action.saleItemTier = item.tier
  action.saleItemState = state
  action.saleItemValue = visitorDemand.value
  action.type = ACTIONS.sellToVisitor
  return action
}
