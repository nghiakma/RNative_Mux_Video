import { CounterActions } from '../actions/counter.actions';

const initState = {
    count: 0
}

export const CounterReducer = (state = initState, actions: Action) => {
    switch (actions.type) {
        case CounterActions.INCREASE:
            return {
                ...state, count: state.count + 1
            }
        case CounterActions.DECREASE:
            return {
                ...state, count: state.count - 1
            }
        default:
            return {
                ...state
            }
    }
}