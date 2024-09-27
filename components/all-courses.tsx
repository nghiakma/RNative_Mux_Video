import { URL_SERVER } from "@/utils/url";
import { Nunito_500Medium, Nunito_600SemiBold } from "@expo-google-fonts/nunito";
import { Raleway_600SemiBold, Raleway_700Bold } from "@expo-google-fonts/raleway";
import axios from "axios";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import CourseCard from "./cards/course.card";
import { Zocial } from "@expo/vector-icons";

const AllCourses = () => {
    const [courses, setCourses] = useState<CoursesType[]>([]);
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef(null);

    useEffect(() => {
        loadAllCourses();
    }, [])

    const loadAllCourses = async () => {
        try {
            const response = await axios.get(`${URL_SERVER}/get-courses`);
            setCourses([...response.data.courses]);
        } catch (error) {
            console.log(error);
        }
    }

    let [fontsLoaded, fontError] = useFonts({
        Raleway_700Bold,
        Nunito_600SemiBold,
        Raleway_600SemiBold,
        Nunito_500Medium,
    });

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <View style={{ flex: 1, marginHorizontal: 16 }}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}
            >
                <Text
                    style={{
                        fontSize: 20,
                        color: "#000",
                        fontFamily: "Raleway_700Bold"
                    }}
                >
                    Nổi bật
                </Text>
                <TouchableOpacity
                    onPress={() => router.push("/(tabs)/courses")}
                    style={{ alignItems: "center", justifyContent: "center" }}
                >
                    <Text style={{
                        fontSize: 15,
                        color: "#2467EC",
                        fontFamily: "Nunito_600SemiBold"
                    }}>
                        Tất cả
                    </Text>
                </TouchableOpacity>
            </View>
            {courses.length > 0 && (
                courses.map((item: any, index: number) => (
                    <View key={index}>
                        <CourseCard item={item} key={item._id} />
                    </View>
                ))
            )}
            {courses.length === 0 && (
                <View style={{ flex: 1, marginTop: 10 }}>
                    <View style={{ width: "100%" }}>
                        <Zocial name="cloudapp" size={60} style={{ textAlign: "center" }} color="#ccc" />
                    </View>
                    <Text style={{ textAlign: 'center' }}>Không tồn tại dữ liệu</Text>
                </View>
            )}
        </View>
    )
}

export default AllCourses;