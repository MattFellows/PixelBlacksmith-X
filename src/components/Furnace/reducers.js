const initialState = {
    craftingQueue: []
};

function furnaceReducer(state = initialState, action) {
    if (action.type === 'smelt') {
        let newCraftingQueue = [...state.craftingQueue];
        newCraftingQueue.push({
            image: action.image,
            count: action.count,
            product: action.product,
            time: [action.time[0] * action.count, action.time[1]],
        })
        return {
            ...state,
            craftingQueue: newCraftingQueue,
        }
    }
    return state;
}

export default furnaceReducer;
