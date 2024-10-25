import CourseCard from "@/components/cards/course.card";
import CourseProgress from "@/components/cards/course.progress";
import Loader from "@/components/loader";
import useUser from "@/hooks/useUser";
import { URL_SERVER } from "@/utils/url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import * as Progress from "react-native-progress";
import {
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useSelector } from "react-redux";

const index = () => {
    const [loader, setLoader] = useState(false);
    const { loading } = useUser();
    const progresses = useSelector((state: any) => state.user.progress)
    // useFocusEffect(
    //     useCallback(() => {
    //         FetchCoursesOfUser();
    //     }, [])
    // )

    // const FetchCoursesOfUser = async () => {
    //     let paymented: { _id: string }[] = [];
    //     try {
    //         let stringifyPaymented = await AsyncStorage.getItem("paymented");
    //         if (stringifyPaymented) {
    //             paymented = JSON.parse(stringifyPaymented);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    //     try {
    //         const accessToken = await AsyncStorage.getItem("access_token");
    //         const refreshToken = await AsyncStorage.getItem("refresh_token");
    //         const responseUser = await axios.get(`${URL_SERVER}/me`, {
    //             headers: {
    //                 "access-token": accessToken,
    //                 "refresh-token": refreshToken
    //             }
    //         })
    //         const userCourses: { _id: string }[] = responseUser.data.user.courses || [];
    //         const response = await axios.get(`${URL_SERVER}/get-courses`, {
    //             headers: { 'Cache-Control': 'no-cache' }
    //         });
    //         const courses: CoursesType[] = response.data.courses;
    //         const coursesOfUser: CoursesType[] = [];
    //         // Duyệt qua các khóa học và thêm vào danh sách khóa học của người dùng nếu tồn tại
    //         courses.forEach((course: CoursesType) => {
    //             const isUserCourse = userCourses.some((userCourse: any) => userCourse._id === course._id);
    //             const isPaymentedCourse = paymented.some(payment => payment._id === course._id);

    //             if (isPaymentedCourse || isUserCourse) {
    //                 coursesOfUser.push(course);
    //             }
    //         });

    //         setCourses(coursesOfUser);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    return (
        <>
            {loader || loading ? (
                <Loader />
            ) : (
                <ScrollView style={{ flex: 1, paddingTop: 10 }}>
                    { progresses.length > 0 ? 
                        progresses.map((progress: any, index: number) => (
                            <View key={`${index}-umbala`} style={{marginBottom: 10}}>
                                <CourseProgress progress={progress}/>
                            </View>
                        ))
                        :
                        <View>
                            <Text>Không có dữ liệu</Text>
                        </View>
                    }
                </ScrollView>
            )}
        </>
    )
}

const styles = StyleSheet.create({})

export default index;