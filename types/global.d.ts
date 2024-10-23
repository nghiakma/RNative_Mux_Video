type onboardingSwiperDataType = {
    id: number;
    title: string;
    description: string;
    sortDescription: string;
    sortDescription2?: string;
    image: any;
}

type Avatar = {
    public_id?: string;
    url: string;
}

type User = {
    _id: string;
    name: string;
    email: string;
    avatar?: Avatar;
    password?: string;
    courses: any;
    createdAt: Date;
    updatedAt: Date;
}

type OwnerQuizz = {
    _id: string;
    userId: string;
    courseId: string;
    lessonId: string;
    scored: number;
    selected_options: object;
}

type Progress = {
    courseId: string;
    chapters: Chapter[]
}

type Chapter = {
    chapterId: string;
    isCompleted: boolean;
}

type BannerDataTypes = {
    bannerImageUrl: any;
}

type Action = {
    type: string,
    payload?: any
}

declare module "*.png";

declare module 'react-native-animated-loader'