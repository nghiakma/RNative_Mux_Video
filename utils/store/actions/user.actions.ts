export const UserActions = Object.freeze({
    SAVE_PROGRESS: 'SAVE_PROGRESS',
    PUSH_PROGRESS: 'PUSH_PROGRESS'
})

export const saveProgressOfUser = (payload: { courseId: string; progress: number; }[]) => ({
    type: UserActions.SAVE_PROGRESS,
    payload: payload
})

export const pushProgressOfUser = (payload: { courseId: string, progress: number }) => ({
    type: UserActions.PUSH_PROGRESS,
    payload: payload
})