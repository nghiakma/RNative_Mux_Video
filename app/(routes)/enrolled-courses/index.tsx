import CourseCard from "@/components/cards/course.card";
import Loader from "@/components/loader";
import useUser from "@/hooks/useUser";
import { URL_SERVER } from "@/utils/url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const index = () => {
    const [courses, setCourses] = useState<CoursesType[]>([]);
    const [loader, setLoader] = useState(false);
    const { loading } = useUser();

    useFocusEffect(
        useCallback(() => {
            FetchCoursesOfUser();
        }, [])
    )

    const FetchCoursesOfUser = async () => {
        let paymented: { _id: string }[] = [];
        try {
            let stringifyPaymented = await AsyncStorage.getItem("paymented");
            if (stringifyPaymented) {
                paymented = JSON.parse(stringifyPaymented);
            }
        } catch (error) {
            console.log(error);
        }
        try {
            const accessToken = await AsyncStorage.getItem("access_token");
            const refreshToken = await AsyncStorage.getItem("refresh_token");
            const responseUser = await axios.get(`${URL_SERVER}/me`, {
                headers: {
                    "access-token": accessToken,
                    "refresh-token": refreshToken
                }
            })
            const userCourses: { _id: string }[] = responseUser.data.user.courses || [];
            const response = await axios.get(`${URL_SERVER}/get-courses`, {
                headers: { 'Cache-Control': 'no-cache' }
            });
            const courses: CoursesType[] = response.data.courses;
            const coursesOfUser: CoursesType[] = [];
            // Duyệt qua các khóa học và thêm vào danh sách khóa học của người dùng nếu tồn tại
            courses.forEach((course: CoursesType) => {
                const isUserCourse = userCourses.some((userCourse: any) => userCourse._id === course._id);
                const isPaymentedCourse = paymented.some(payment => payment._id === course._id);

                if (isPaymentedCourse || isUserCourse) {
                    coursesOfUser.push(course);
                }
            });

            setCourses(coursesOfUser);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            {loader || loading ? (
                <Loader />
            ) : (
                <View style={{ flex: 1 }}>
                    <FlatList
                        style={{ paddingHorizontal: 15 }}
                        data={courses}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item._id + ""}
                        renderItem={({ item }) => <CourseCard item={item} />}
                    />
                </View>
            )}
        </>
    )
}

export default index;