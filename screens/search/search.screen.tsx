import CourseCard from "@/components/cards/course.card";
import SearchInput from "@/components/search.input";
import { URL_SERVER } from "@/utils/url";
import { Nunito_700Bold } from "@expo-google-fonts/nunito";
import { AntDesign, Zocial } from "@expo/vector-icons";
import axios from "axios";
import { useFonts } from "expo-font";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

const styles = StyleSheet.create({
    filteringContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 16,
    },

    searchContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 5,
        paddingHorizontal: 10,
        marginHorizontal: "auto"
    },

    searchIconContainer: {
        width: 36,
        height: 36,
        backgroundColor: "#2467EC",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
    },

    input: {
        flex: 1,
        fontSize: 14,
        color: "black",
        paddingVertical: 10,
        width: 271,
        height: 48,
    },
});

const SearchScreen = () => {

    const [value, setValue] = useState("");
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);

    useFocusEffect(
        useCallback(() => {
            loadAllCourses();
        }, [])
    );

    useEffect(() => {
        if (value === "") {
            setFilteredCourses(courses);
        } else if (value.length > 0) {
            const filtered = courses.filter((course: CoursesType) => course.name.toLowerCase().includes(value.toLowerCase()));
            setFilteredCourses(filtered);
        }
    }, [value, courses])

    const loadAllCourses = async () => {
        try {
            const response = await axios.get(`${URL_SERVER}/get-courses`);
            setCourses(response.data.courses);
            setFilteredCourses(response.data.courses);
        } catch (error) {
            console.log(error);
        }
    }

    let [fontsLoaded, fontError] = useFonts({
        Nunito_700Bold,
    });

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <ScrollView style={{ flex: 1, marginTop: 10 }}>
            <View style={styles.filteringContainer}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={[styles.input, { fontFamily: 'Nunito_700Bold' }]}
                        placeholder="Search"
                        onChangeText={(v) => setValue(v)}
                        placeholderTextColor={"#C67CCC"}
                    />
                    <TouchableOpacity
                        style={styles.searchIconContainer}
                        onPress={() => router.push("/(tabs)/search")}
                    >
                        <AntDesign name="search1" size={20} color={"#fff"} />
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                {filteredCourses.length > 0 && filteredCourses.map((item: any, index: number) => (
                    <View key={`${index}-c`}>
                        <CourseCard item={item} />
                    </View>
                ))}
            </View>
            {filteredCourses.length === 0 && (
                <View style={{ flex: 1, marginHorizontal: 18, marginTop: 20 }}>
                    <View style={{ width: "100%" }}>
                        <Zocial name="cloudapp" size={60} style={{ textAlign: "center" }} color="#ccc" />
                    </View>
                    <Text style={{ textAlign: 'center' }}>Không tồn tại dữ liệu</Text>
                </View>
            )}
        </ScrollView>
    )
}

export default SearchScreen;