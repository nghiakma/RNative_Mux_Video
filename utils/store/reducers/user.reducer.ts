import { UserActions } from "../actions/user.actions"

const initState = {
    progress: []
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
        default:
            return {
                ...state
            }
    }
}