import CourseCard from "@/components/cards/course.card";
import Loader from "@/components/loader";
import { URL_SERVER } from "@/utils/url";
import { Nunito_400Regular, Nunito_700Bold, Nunito_500Medium, Nunito_600SemiBold } from "@expo-google-fonts/nunito";
import { Raleway_600SemiBold, Raleway_700Bold } from "@expo-google-fonts/raleway";
import { Zocial } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import {
    widthPercentageToDP as wp
} from "react-native-responsive-screen"

const CoursesScreen = () => {
    const [courses, setCourses] = useState<CoursesType[]>([]);
    const [originalCourses, setOriginalCourses] = useState<CoursesType[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [progresses, setProgresses] = useState<Progress[]>([]);
    
    useEffect(() => {
        FetchCategories();
        FetchCourses();
        loadProgressOfUser();
    }, []);

    const FetchCategories = async () => {
        try {
            const response = await axios.get(`${URL_SERVER}/get-layout/Categories`);
            setCategories(response.data.layout.categories);
        } catch (error) {
            console.log(error);
        }
    }

    const FetchCourses = async () => {
        try {
            const response = await axios.get(`${URL_SERVER}/get-courses`);
            setCourses(response.data.courses);
            setOriginalCourses(response.data.courses);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    const loadProgressOfUser = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('access_token');
            const refreshToken = await AsyncStorage.getItem('refresh_token');
            const response = await axios.get(`${URL_SERVER}/user/progress`, {
                headers: {
                    'access-token': accessToken,
                    'refresh-token': refreshToken
                }
            });
            let _processes: Progress[] = [];
            if(response.data.response && response.data.response.progress){
                let _ = response.data.response.progress;
                _processes = _.map((progress: Progress) => ({
                    courseId: progress.courseId,
                    chapters: progress.chapters.map((chapter: Chapter) => ({
                        chapterId: chapter.chapterId,
                        isCompleted: chapter.isCompleted
                    }))
                }));
            }
            setProgresses(_processes);
        } catch (error) {
            console.log(error);
        }
    }

    let [fontsLoaded, fontsError] = useFonts({
        Raleway_700Bold,
        Nunito_400Regular,
        Nunito_700Bold,
        Nunito_500Medium,
        Nunito_600SemiBold,
        Raleway_600SemiBold,
    });

    if (!fontsLoaded && !fontsError) {
        return null;
    }

    const OnHandleCategories = (c: string) => {
        setActiveCategory(c);
        if (c === "All") {
            setCourses(originalCourses);
        } else {
            const filteredCourses = originalCourses.filter(
                (i: CoursesType) => i.categories === c
            );
            setCourses(filteredCourses);
        }
    }

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <View style={{ flex: 1 }}>
                    <View style={{ padding: 10 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <TouchableOpacity
                                style={{
                                    padding: 10,
                                    backgroundColor: activeCategory === "All" ? "#2467EC" : "#ccc",
                                    borderRadius: 20,
                                    paddingHorizontal: 20,
                                    marginRight: 5
                                }}
                                onPress={() => OnHandleCategories("All")}
                            >
                                <Text style={{ color: "#FFF", fontSize: 14, fontWeight: "600" }}>
                                    Tất cả
                                </Text>
                            </TouchableOpacity>
                            {categories?.map((item: any, index: number) => (
                                <TouchableOpacity
                                    key={index}
                                    style={{
                                        padding: 10,
                                        backgroundColor: activeCategory === item?.title ? "#2467EC" : "#ccc",
                                        borderRadius: 50,
                                        paddingHorizontal: 20,
                                        marginRight: 5
                                    }}
                                    onPress={() => OnHandleCategories(item?.title)}
                                >
                                    <Text style={{ color: "#FFF", fontSize: 14, fontWeight: "600" }}>
                                        {item?.title}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                    {courses.length > 0 && (
                        <ScrollView style={{ gap: 10, flex: 1 }} showsVerticalScrollIndicator={false}>
                            {courses?.map((item: CoursesType, index: number) => (
                                <View style={{width: wp(90), marginHorizontal: 'auto'}}>
                                    <CourseCard item={item} key={index}/>
                                </View>
                            ))}
                        </ScrollView>
                    )}
                    {courses?.length === 0 && (
                        <View style={{ flexDirection: "column", alignItems: "center", width: "100%" }}>
                            <View style={{ width: "100%" }}>
                                <Zocial name="cloudapp" size={60} style={{ textAlign: "center" }} color="#ccc" />
                            </View>
                            <Text style={{ textAlign: "center", fontSize: 16 }}>
                                Không tồn tại dữ liệu
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </>
    )
}

export default CoursesScreen;