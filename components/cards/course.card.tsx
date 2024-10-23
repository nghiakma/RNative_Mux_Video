import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import * as Progress from "react-native-progress";
import { useSelector } from "react-redux";

export default function CourseCard({ item }: { item: CoursesType }) {
    const [showProgress, setShowProgress] = useState(false);
    const [progressFill, setProgressFill] = useState(0);
    const progresses = useSelector((state: any) => state.user.progress);

    useEffect(() => {
        checkPurchasedCourse();
    }, [progresses])

    const checkPurchasedCourse = () => {
        let purchased = progresses.length > 0 && progresses.find((pro: any) => pro.courseId === item._id);
        
        if(purchased){
            setShowProgress(true);
            calculateProgressBar();
        }
    }

    const calculateProgressBar = () => {
        let progress = progresses.find((pro: any) => pro.courseId === item._id);
        let progressBarValue = progress.progress * 100;
        setProgressFill(progressBarValue);
    }

    const getProgressColor = () => {
        let progress: number = progressFill / 100;
        return progress < 0.5 ? '#1c86b7' : '#237867';
    }

    return (
        <TouchableOpacity
            style={[styles.container, { marginHorizontal: "auto" }]}
            onPress={() =>
                router.push({
                    pathname: "/(routes)/course-details",
                    params: { item: JSON.stringify(item) },
                })
            }
        >
            <View style={{ paddingHorizontal: 10, marginHorizontal: "auto" }}>
                <Image
                    style={{
                        width: wp(80),
                        height: 200,
                        borderRadius: 5,
                        alignSelf: "center",
                        objectFit: "cover",
                    }}
                    source={{ uri: item.thumbnail.url }}
                />
                <View style={{ width: wp(80) }}>
                    <Text
                        style={{
                            fontSize: 14,
                            textAlign: "left",
                            marginTop: 10,
                            fontFamily: "Raleway_600SemiBold",
                        }}
                    >
                        {item.name}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "#141517",
                            padding: 4,
                            borderRadius: 5,
                            gap: 4,
                            paddingHorizontal: 10,
                            height: 28,
                            marginTop: 10,
                        }}
                    >
                        <FontAwesome name="star" size={14} color={"#ffb800"} />
                        <Text style={[styles.ratingText]}>{item?.ratings?.toFixed(1)}</Text>
                    </View>
                    <Text>{item.purchased} <FontAwesome5 name="user" size={14} color="black" /></Text>
                </View>
                { showProgress ? (
                    <View style={{gap: 4, paddingTop: 10}}>
                        <Progress.Bar 
                            progress={progressFill / 100}
                            width={wp(80)}
                            color={getProgressColor()}
                        />
                        <Text 
                            style={{
                                color: getProgressColor()
                            }}
                        >
                            Hoàn thành {Math.round(progressFill)}%
                        </Text>
                    </View>
                ):(
                    <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingBottom: 5,
                    }}
                    >
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ paddingTop: 10, fontSize: 18, fontWeight: "600" }}>
                                {item?.price}đ
                            </Text>
                            <Text
                                style={{
                                    paddingLeft: 5,
                                    textDecorationLine: "line-through",
                                    fontSize: 16,
                                    fontWeight: "400",
                                }}
                            >
                                {item?.estimatedPrice}đ
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Ionicons name="list-outline" size={20} color={"#8A8A8A"} />
                            <Text style={{ marginLeft: 5 }}>
                                {item.courseData.length} Bài học
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFF",
        marginHorizontal: 6,
        borderRadius: 12,
        width: "100%",
        height: "auto",
        overflow: "hidden",
        margin: "auto",
        marginVertical: 15,
        padding: 8
    },
    ratingText: {
        color: "white",
        fontSize: 14,
    },
});