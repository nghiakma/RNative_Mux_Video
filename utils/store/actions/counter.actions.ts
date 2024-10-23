export const CounterActions = Object.freeze({
    INCREASE: 'INCREASE',
    DECREASE: 'DECREASE'
})

export const increaseCounter = () => ({
    type: CounterActions.INCREASE,
    payload: null
})

export const decreaseCounter = () => ({
    type: CounterActions.DECREASE,
    payload: null
})