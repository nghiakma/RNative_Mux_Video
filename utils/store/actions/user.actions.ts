export const UserActions = Object.freeze({
    SAVE_PROGRESS: 'SAVE_PROGRESS',
    PUSH_PROGRESS: 'PUSH_PROGRESS',
    SAVE_PAYMENTED: 'SAVE_PAYMENTED',
    RESET_PAYMENTED: 'RESET_PAYMENTED',
    SAVE_WISHLIST: 'SAVE_WISHLIST',
    PUSH_WISHCOURSE: 'PUSH_WISHCOURSE',
    REMOVE_WISHCOURSE: 'REMOVE_WISHCOURSE',
    RESET_WISHLIST: 'RESET_WISHLIST',
    SAVE_USER_INFO: 'SAVE_USER_INFO',
    RESET_USER_INFO: 'RESET_USER_INFO'
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

export const saveWishList = (payload: { _id: string, userId: string, courseId: string }[]) => ({
    type: UserActions.SAVE_WISHLIST,
    payload: payload
});

export const pushWishCourse = (payload: { _id: string, userId: string, courseId: string }) => ({
    type: UserActions.PUSH_WISHCOURSE,
    payload: payload
});

export const removeWishCourse = (payload: { _id: string }) => ({
    type: UserActions.REMOVE_WISHCOURSE,
    payload: payload
});

export const saveUserInfo = (payload: { _id: string, name: string, email: string, avatarUrl: string }) => ({
    type: UserActions.SAVE_USER_INFO,
    payload: payload
});

export const resetUserInfo = () => ({
    type: UserActions.RESET_USER_INFO
});