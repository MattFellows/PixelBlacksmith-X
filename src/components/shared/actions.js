export const ACTIONS = {
    POPUP: 'POPUP',
}

export const setPopup = (popupType, trader) => {
    let action = {
        type: ACTIONS.POPUP,
        popup: popupType,
        trader: trader,
    };
    return action
}
