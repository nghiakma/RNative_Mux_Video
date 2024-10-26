export const UserActions = Object.freeze({
    SAVE_PROGRESS: 'SAVE_PROGRESS',
    PUSH_PROGRESS: 'PUSH_PROGRESS',
    SAVE_PAYMENTED: 'SAVE_PAYMENTED',
    RESET_PAYMENTED: 'RESET_PAYMENTED'
})

export const saveProgressOfUser = (payload: { courseId: string; progress: number; name: string, total: number }[]) => ({
    type: UserActions.SAVE_PROGRESS,
    payload: payload
})

export const pushProgressOfUser = (payload: { courseId: string, progress: number, name: string, total: number }) => ({
    type: UserActions.PUSH_PROGRESS,
    payload: payload
})

export const savePaymented = (payload: any) => ({
    type: UserActions.SAVE_PAYMENTED,
    payload: payload
})

export const resetPaymented = () => ({
    type: UserActions.RESET_PAYMENTED
})