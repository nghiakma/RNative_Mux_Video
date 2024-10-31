import { UserActions } from "../actions/user.actions"

const initState = {
    progress: [],
    paymented: [],
    wishList: []
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
        case UserActions.SAVE_WISHLIST: {
            return {
                ...state,
                wishList: [...actions.payload]
            }
        }
        case UserActions.RESET_WISHLIST: {
            return {
                ...state,
                wishList: []
            }
        }
        case UserActions.PUSH_WISHCOURSE: {
            let _wishList = [...state.wishList, actions.payload];
            return {
                ...state,
                wishList: _wishList
            }
        }
        case UserActions.REMOVE_WISHCOURSE: {
            let _wishList = state.wishList.filter((item: any) => item._id !== actions.payload?._id);
            return {
                ...state,
                wishList: _wishList
            }
        }
        default:
            return {
                ...state
            }
    }
}