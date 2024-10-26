import { UserActions } from "../actions/user.actions"

const initState = {
    progress: [],
    paymented: []
}

export const UserReducer = (state = initState, actions: Action) => {
    switch (actions.type) {
        case UserActions.SAVE_PROGRESS: {
            return {
                ...state,
                progress: [...actions.payload]
            }
        }
        case UserActions.PUSH_PROGRESS: {
            let _progress = state.progress.filter((pro: any) => pro.courseId !== actions.payload.courseId)
            let newProgress = [..._progress, actions.payload];
            return {
                ...state,
                progress: [...newProgress]
            }
        }
        case UserActions.SAVE_PAYMENTED: {
            let _paymented: any = state.paymented;
            let _payload: { _id: string } = { _id: actions.payload._id };
            _paymented = [...state.paymented, _payload];
            console.log(_paymented);
            return {
                ...state,
                paymented: [..._paymented]
            }
        }
        case UserActions.RESET_PAYMENTED: {
            return {
                ...state,
                paymented: []
            }
        }
        default:
            return {
                ...state
            }
    }
}