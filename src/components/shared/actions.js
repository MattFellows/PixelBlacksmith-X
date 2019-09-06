export const ACTIONS = {
    POPUP: 'POPUP',
}

export const setPopup = (popupType) => {
    return {
        type: ACTIONS.POPUP,
        popup: popupType,
    }
}