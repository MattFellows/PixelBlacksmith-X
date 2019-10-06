export const ACTIONS = {
    POPUP: 'POPUP',
}

export const setPopup = (popupType, trader) => {
    console.log('Set Popup:', popupType, trader);
    let action = {
        type: ACTIONS.POPUP,
        popup: popupType,
        trader: trader,
    };
    console.log(action);
    return action
}
