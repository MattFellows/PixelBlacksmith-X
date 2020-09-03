export const ACTIONS = {
    POPUP: 'POPUP',
}

export const setPopup = (popupType, trader, visitor) => {
    let action = {
        type: ACTIONS.POPUP,
        popup: popupType,
        trader: trader,
        visitor: visitor,
    };
    return action
}
