import CourseCard from "@/components/cards/course.card";
import Loader from "@/components/loader";
import { URL_SERVER } from "@/utils/url";
import axios from "axios";
import { useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

import { 
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useFonts } from "expo-font";
import { Nunito_400Regular, Nunito_500Medium, Nunito_700Bold, Nunito_600SemiBold } from "@expo-google-fonts/nunito";
import { Raleway_600SemiBold, Raleway_700Bold } from "@expo-google-fonts/raleway";

const WishListScreen = () => {
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState<CoursesType[]>([])
    const [filteredCourses, setFilterdCourses] = useState<CoursesType[]>([]);
    const wishList = useSelector((state: any) => state.user.wishList);

    useEffect(() => {
        fetchCourses();
    }, [])

    useEffect(() => {
        filterCourses();
    }, [courses])

    useEffect(() => {
        filterCourses();
    }, [wishList])

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${URL_SERVER}/get-courses`);
            setCourses([...response.data.courses]);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    const filterCourses = () => {
        const _filtered = courses.filter(course => wishList.find((item: any) => item.courseId === course._id))
        setFilterdCourses(_filtered);
    }

    let [fontsLoaded, fontsError] = useFonts({
        Raleway_600SemiBold,
        Raleway_700Bold,
        Nunito_400Regular,
        Nunito_500Medium,
        Nunito_700Bold,
        Nunito_600SemiBold,
    });

    if (!fontsLoaded && !fontsError) {
        return null;
    }

    return (
        <>
            { loading ? (
                <Loader />
            ):(
                <View style={styles.container}>
                    <View style={styles.circle1}></View>
                    <View style={styles.circle2}></View>
                    <View style={styles.circle3}></View>
                    <View style={[styles.titleContainer]}>
                        <Text style={[styles.titleText, {fontFamily: 'Nunito_600SemiBold'}]}>Khóa học yêu thích</Text>
                    </View>
                    <ScrollView style={{marginTop: 20, flex: 1, marginHorizontal: 'auto', position: 'relative', zIndex: 99}} showsVerticalScrollIndicator={false}>
                        { filteredCourses.length > 0 && (
                            filteredCourses.map(course => (
                                <View style={{width: wp(90)}} key={course._id}>
                                    <CourseCard item={course}/>
                                </View>
                            ))
                        )}
                    </ScrollView>
                </View>
            )}
        </>
    )

}

const styles = StyleSheet.create({
    container: {
        position: 'relative', 
        height: 600, 
        flex: 1,
        backgroundColor: '#f8f8f8'
    },
    titleContainer: {
        width: wp(90),
        marginHorizontal: 'auto',
        marginTop: 10,
        marginBottom: 20
    },
    titleText:{
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
    },

    circle1: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(0, 0, 255, 0.05)',
        position: 'absolute',
        top: -20,
        right: 80,
        zIndex: 1
    },
    circle2: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(0, 128, 0, 0.07)',
        position: 'absolute',
        top: 20,
        right: 130,
        zIndex: 2
    },
    circle3: {
        width: 200,
        height: 200,
        borderRadius: 200,
        backgroundColor: 'rgba(135, 206, 235, 0.1)', 
        position: 'absolute',
        top: 30,
        right: -30, 
        zIndex: 6
    }
})

export default WishListScreen;