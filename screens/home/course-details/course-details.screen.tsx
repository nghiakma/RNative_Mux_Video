import ReviewCard from "@/components/cards/review.card";
import CourseLesson from "@/components/course-lesson";
import Loader from "@/components/loader";
import useUser from "@/hooks/useUser";
import { URL_SERVER } from "@/utils/url";
import { Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold } from "@expo-google-fonts/nunito";
import { Raleway_600SemiBold, Raleway_700Bold } from "@expo-google-fonts/raleway";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { useFonts } from "expo-font";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Image, ScrollView, Text, TouchableOpacity, View, SafeAreaView,
    StyleSheet,
} from "react-native"
import { Colors } from 'react-native/Libraries/NewAppScreen';

// import WebView from "react-native-webview";
// import { VdoPlayerView } from "vdocipher-rn-bridge";
// import WebView from "react-native-webview";
// import Video, { VideoRef } from 'react-native-video';
// import { VdoPlayerView } from 'vdocipher-rn-bridge';
import Video from 'react-native-video'; // import Video from react-native-video like your normally would
import muxReactNativeVideo from '@mux/mux-data-react-native-video';
import app from '../../../package.json'
const MuxVideo = muxReactNativeVideo(Video);
const CourseDetailsScreen = () => {
    const [activeButton, setActiveButton] = useState("About");
    const { user, loading } = useUser();
    const [isExpanded, setIsExpanded] = useState(false);
    const { item } = useLocalSearchParams();
    const courseData: CoursesType = JSON.parse(item as string);
    const [courseInfo, setCourseInfo] = useState<CoursesType>();
    const [checkPurchased, setCheckPurchased] = useState(false);

    const [showVideo, setShowVideo] = useState(false);
    const ref = React.useRef<any>(null);
    useEffect(() => { }, []);

    useEffect(() => {
        if (user?.courses.find((i: any) => i._id === courseData._id)) {
            setCheckPurchased(true);
        }
    }, [user])

    const [videoData, setVideoData] = useState({
        otp: "",
        playbackInfo: ""
    });

    const LoadCourse = async () => {
        let paymented: { _id: string }[] = [];
        try {
            let data = await AsyncStorage.getItem("paymented");
            if (data) {
                paymented = JSON.parse(data);
            }
            const response = await axios.get(`${URL_SERVER}/get-courses`);
            const _data: CoursesType = response.data?.courses?.filter((item: any) => item._id === courseData._id)[0];
            axios.post(`${URL_SERVER}/getVdoCipherOTP`, {
                videoId: _data.demoUrl
            })
                .then((res) => {
                    setVideoData({
                        otp: res?.data.otp,
                        playbackInfo: res?.data.playbackInfo
                    });
                })

            const isPaymentedCourse = paymented.some((item) => item._id === _data._id);
            const isUserCourse = user?.courses.some((item: any) => item._id === _data._id);
            if (isPaymentedCourse || isUserCourse) {
                setCheckPurchased(true);
            }
            setCourseInfo(_data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        LoadCourse();
    }, [])

    useFocusEffect(
        useCallback(() => {
            LoadCourse();
        }, [])
    )

    const OnHandleAddToCart = async () => {
        try {
            const existingCartData = await AsyncStorage.getItem("cart");
            const cartData = existingCartData ? JSON.parse(existingCartData) : [];
            const accessToken = await AsyncStorage.getItem("access_token");
            const refreshToken = await AsyncStorage.getItem("refresh_token");
            let itemExists = cartData.some((item: any) => item._id === courseData._id);

            if (!itemExists) {
                cartData.unshift(courseData)
                await AsyncStorage.setItem("cart", JSON.stringify(cartData));
                await axios.put(`${URL_SERVER}/add-course`, courseData, {
                    headers: {
                        "access-token": accessToken,
                        "refresh-token": refreshToken
                    }
                });
            }
            router.push("/(routes)/cart");
        } catch (error: any) {
            console.log(error.message);
        }
    }

    let [fontsLoaded, fontError] = useFonts({
        Raleway_600SemiBold,
        Raleway_700Bold,
        Nunito_400Regular,
        Nunito_500Medium,
        Nunito_700Bold,
        Nunito_600SemiBold,
    });

    if (!fontsLoaded && !fontError) {
        return null;
    }
    const embedInfo = {
        otp: '______',
        playbackInfo: '______',
        playerConfig: '______' // <-- player id goes here
    };
    useEffect(() => {
        embedInfo.otp = videoData.otp;
        embedInfo.playbackInfo = videoData.playbackInfo;
    }, [videoData.otp])
    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <View style={{ flex: 1, marginTop: 16 }}>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                        <View style={{ marginHorizontal: 16 }}>
                            <View
                                style={{
                                    position: "absolute",
                                    zIndex: 1,
                                    backgroundColor: "#FFB013",
                                    borderRadius: 54,
                                    paddingVertical: 8,
                                    paddingHorizontal: 12,
                                    marginTop: 8,
                                    marginLeft: 20
                                }}
                            >
                                <Text style={{ color: "black", fontSize: 14, fontFamily: "Nunito_600SemiBold" }}>
                                    Bán chạy
                                </Text>
                            </View>
                            <View style={{ position: "absolute", zIndex: 14, right: 0 }}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        backgroundColor: "#141517",
                                        paddingVertical: 6,
                                        paddingHorizontal: 12,
                                        borderRadius: 3,
                                        marginTop: 8,
                                        marginRight: 8,
                                    }}
                                >
                                    <FontAwesome name="star" size={14} color={"#FFB800"} />
                                    <Text
                                        style={{
                                            color: "white",
                                            marginLeft: 4,
                                            fontFamily: "Nunito_600SemiBold",
                                        }}
                                    >
                                        {courseData?.ratings?.toFixed(1)}
                                    </Text>
                                </View>
                            </View>
                            <Image
                                source={{ uri: courseData?.thumbnail.url! }}
                                style={{ width: "100%", height: 230, borderRadius: 6 }}
                            />
                            <View style={{ width: "100%", aspectRatio: 18 / 9, borderRadius: 10 }}>

                                <MuxVideo
                                    style={styles.video}
                                    source={{
                                        uri:
                                            'https://stream.mux.com/TNeEM1221KC00xop02yHEf02ahkXbAjQezSFTwMlceZJa8.m3u8',
                                    }}
                                    controls
                                    muted
                                    muxOptions={{
                                        application_name: app.name,            // (required) the name of your application
                                        application_version: app.version,      // the version of your application (optional, but encouraged)
                                        data: {
                                            env_key: '8m01he8sfkme3cie3juold22i',     // (required)
                                            video_id: 'OM002jcb6iQUXZqpIzYrZiGUXT5HA5l005dzFW12UVmvQ',             // (required)
                                            video_title: 'My awesome video',
                                            player_software_version: '5.0.2',     // (optional, but encouraged) the version of react-native-video that you are using
                                            player_name: 'React Native Player',  // See metadata docs for available metadata fields https://docs.mux.com/docs/web-integration-guide#section-5-add-metadata
                                        },
                                    }}
                                />

                                {/* <WebView
                                    source={{ uri: `https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}&player=yhSoI6rb4DYEOhvk` }}
                                    allowsFullscreenVideo={true}
                                    javaScriptEnabled={true}
                                    originWhitelist={['*']}
                                /> */}
                                {/* <WebView
                                    source={{ uri: `Snaptik.app_7348794117838687506.mp4` }}
                                    allowsFullscreenVideo={true}
                                    javaScriptEnabled={true}
                                    originWhitelist={['*']}
                                /> */}
                                {/* <VdoPlayerView
                                    embedInfo={embedInfo}
                                /> */}
                            </View>
                            <Text
                                style={{
                                    marginHorizontal: 16,
                                    marginTop: 15,
                                    fontSize: 20,
                                    fontWeight: "600",
                                    fontFamily: "Raleway_700Bold",
                                }}
                            >
                                {courseData?.name}
                            </Text>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    paddingRight: 10,
                                    paddingTop: 5
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        paddingRight: 10,
                                        paddingTop: 5
                                    }}
                                >
                                    <View
                                        style={{ flexDirection: "row" }}
                                    >
                                        <Text
                                            style={{
                                                color: "#000",
                                                fontSize: 22,
                                                marginLeft: 10,
                                                paddingVertical: 10,
                                            }}
                                        >
                                            {courseData?.price}đ
                                        </Text>
                                        <Text
                                            style={{
                                                color: "#808080",
                                                fontSize: 20,
                                                marginLeft: 10,
                                                textDecorationLine: "line-through",
                                            }}
                                        >
                                            {courseData?.estimatedPrice}đ
                                        </Text>
                                    </View>
                                </View>
                                <Text style={{ fontSize: 15 }}>
                                    {courseData?.purchased} students
                                </Text>
                            </View>
                            <View style={{ padding: 10 }}>
                                <Text style={{ fontSize: 20, fontWeight: "600" }}>
                                    Các yêu cầu của khóa học
                                </Text>
                                {courseData?.prerequisites.map(
                                    (item: PrerequisiteType, index: number) => (
                                        <View
                                            key={index}
                                            style={{
                                                flexDirection: "row",
                                                width: "95%",
                                                paddingVertical: 5,
                                            }}
                                        >
                                            <Ionicons name="checkmark-done-outline" size={18} />
                                            <Text style={{ paddingLeft: 5, fontSize: 16 }}>
                                                {item.title}
                                            </Text>
                                        </View>
                                    )
                                )}
                            </View>
                            <View style={{ padding: 10 }}>
                                <Text style={{ fontSize: 20, fontWeight: "600" }}>
                                    Lợi ích khóa học mang lại
                                </Text>
                                {courseData?.benefits.map((item: BenefitType, index: number) => (
                                    <View
                                        key={index}
                                        style={{
                                            flexDirection: "row",
                                            width: "95%",
                                            paddingVertical: 5
                                        }}
                                    >
                                        <Ionicons name="checkmark-done-outline" size={18} />
                                        <Text style={{ paddingLeft: 5, fontSize: 16 }}>
                                            {item.title}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginTop: 25,
                                    backgroundColor: "#E1E9F0",
                                    borderRadius: 50
                                }}
                            >
                                <TouchableOpacity
                                    style={{
                                        paddingVertical: 10,
                                        paddingHorizontal: 30,
                                        backgroundColor: activeButton === "About" ? "#2467EC" : "transparent",
                                        borderRadius: activeButton === "About" ? 50 : 0
                                    }}
                                    onPress={() => setActiveButton("About")}
                                >
                                    <Text
                                        style={{
                                            color: activeButton === "About" ? "#fff" : "#000",
                                            fontFamily: "Nunito_600SemiBold"
                                        }}
                                    >
                                        Thông tin
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        paddingVertical: 10,
                                        paddingHorizontal: 36,
                                        backgroundColor:
                                            activeButton === "Lessons" ? "#2467EC" : "transparent",
                                        borderRadius: activeButton === "Lessons" ? 50 : 0,
                                    }}
                                    onPress={() => setActiveButton("Lessons")}
                                >
                                    <Text
                                        style={{
                                            color: activeButton === "Lessons" ? "#fff" : "#000",
                                            fontFamily: "Nunito_600SemiBold",
                                        }}
                                    >
                                        Bài giảng
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        paddingVertical: 10,
                                        paddingHorizontal: 30,
                                        backgroundColor:
                                            activeButton === "Reviews" ? "#2467EC" : "transparent",
                                        borderRadius: activeButton === "Reviews" ? 50 : 0,
                                    }}
                                    onPress={() => setActiveButton("Reviews")}
                                >
                                    <Text
                                        style={{
                                            color: activeButton === "Reviews" ? "#fff" : "#000",
                                            fontFamily: "Nunito_600SemiBold",
                                        }}
                                    >
                                        Nhận xét
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {activeButton === "About" && (
                                <View
                                    style={{
                                        marginHorizontal: 16,
                                        marginVertical: 25,
                                    }}
                                >
                                    <Text style={{ fontSize: 18, fontFamily: "Raleway_700Bold" }}>
                                        Thông tin khóa học
                                    </Text>
                                    <Text
                                        style={{
                                            color: "#525258",
                                            fontSize: 16,
                                            marginTop: 10,
                                            textAlign: "justify",
                                            fontFamily: "Nunito_500Medium",
                                        }}
                                    >
                                        {isExpanded
                                            ? courseData?.description
                                            : courseData?.description.slice(0, 302)}
                                    </Text>
                                    {courseData?.description.length > 302 && (
                                        <TouchableOpacity
                                            style={{ marginTop: 3 }}
                                            onPress={() => setIsExpanded(!isExpanded)}
                                        >
                                            <Text
                                                style={{
                                                    color: "#2467EC",
                                                    fontSize: 14,
                                                }}
                                            >
                                                {isExpanded ? "Show Less" : "Show More"}
                                                {isExpanded ? "-" : "+"}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                            {activeButton === "Lessons" && (
                                <View style={{ marginVertical: 25 }}>
                                    <CourseLesson courseDetails={courseData} />
                                </View>
                            )}
                            {activeButton === "Reviews" && (
                                <View style={{ marginVertical: 25 }}>
                                    <View style={{ rowGap: 25 }}>
                                        {courseInfo?.reviews?.map(
                                            (item: ReviewType, index: number) => (
                                                <View key={`${index}-baa`}>
                                                    <ReviewCard item={item} />
                                                </View>
                                            )
                                        )}
                                    </View>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                    <View
                        style={{
                            backgroundColor: "#FFFF",
                            marginHorizontal: 16,
                            paddingVertical: 11,
                            marginBottom: 10
                        }}
                    >
                        {checkPurchased === true ? (
                            <TouchableOpacity
                                style={{ backgroundColor: "#2467EC", paddingVertical: 16, borderRadius: 4 }}
                                onPress={() => router.push({
                                    pathname: "/(routes)/course-access",
                                    params: { courseData: JSON.stringify(courseData) }
                                })}
                            >
                                <Text
                                    style={{ textAlign: "center", color: "#FFFF", fontSize: 16, fontFamily: "Nunito_600SemiBold" }}
                                >
                                    Di chuyển đến khóa học
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={{
                                    backgroundColor: "#2467EC",
                                    paddingVertical: 16,
                                    borderRadius: 4
                                }}
                                onPress={() => OnHandleAddToCart()}
                            >
                                <Text
                                    style={{
                                        textAlign: "center",
                                        color: "#FFFF",
                                        fontSize: 16,
                                        fontFamily: "Nunito_600SemiBold"
                                    }}
                                >
                                    Thêm vào giỏ
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    video: {
        width: "100%",
        height: 200,

    },
    engine: {
        position: 'absolute',
        right: 0,
    },
    body: {
        backgroundColor: Colors.white,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        color: Colors.dark,
    },
    highlight: {
        fontWeight: '700',
    },
    footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
    },
});
export default CourseDetailsScreen;