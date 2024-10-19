import QuestionsCard from "@/components/cards/question.card";
import ReviewCard from "@/components/cards/review.card";
import Loader from "@/components/loader";
import useUser from "@/hooks/useUser";
import { URL_SERVER } from "@/utils/url";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { widthPercentageToDP } from "react-native-responsive-screen";
import { Toast } from "react-native-toast-notifications";
import app from "../../app.json";
import Video from 'react-native-video';
import muxReactNativeVideo from '@mux/mux-data-react-native-video';
const MuxVideo = muxReactNativeVideo(Video);


const styles = StyleSheet.create({
    button: {
        width: widthPercentageToDP("40%"),
        height: 40,
        backgroundColor: "#2467EC",
        marginVertical: 10,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
    },
});

const CourseAccessScreen = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useUser();
    const { courseData } = useLocalSearchParams();
    const data: CoursesType = JSON.parse(courseData as string);
    const [courseReviews, setCourseReviews] = useState<ReviewType[]>(data?.reviews ? data.reviews : []);

    const [courseContentData, setCourseContentData] = useState<CourseDataType[]>([]);
    const [activeVideo, setActiveVideo] = useState(0);
    const [activeButton, setActiveButton] = useState("About");
    const [question, setQuestion] = useState("");
    const [rating, setRating] = useState(1);
    const [review, setReview] = useState("");
    const [reviewAvailable, setReviewAvailable] = useState(false);
    const [token, setToken] = useState('');

    const [videoData, setVideoData] = useState({
        id: "",
        videoId: ""
    });

    useEffect(() => {
        if (courseContentData[activeVideo]) {
            axios.get(`${URL_SERVER}/getMuxVideoOTP?videoId=${courseContentData[activeVideo].videoUrl}`)
                .then((res) => {
                    setVideoData({
                        id: res.data.data.id,
                        videoId: res.data.data.playback_ids[0].id
                    });
                    axios
                        .get(`${URL_SERVER}/signedUrlMuxVideo`, {
                            params: {
                                videoId: res.data.data.playback_ids[0].id
                            }
                        })
                        .then((res) => {
                            const token = res.data.token;
                            setToken(token);
                        });
                })
        }
    }, [courseContentData[activeVideo], activeVideo])

    useFocusEffect(
        useCallback(() => {
            const subscription = () => {
                FetchCourseContent();
                const isReviewAvailable = courseReviews.find(
                    (i: any) => i.user._id === user?._id
                )
                if (isReviewAvailable) {
                    setReviewAvailable(true);
                }
            }
            subscription();
        }, [])
    )


    const FetchCourseContent = async () => {
        try {
            const accessToken = await AsyncStorage.getItem("access_token");
            const refreshToken = await AsyncStorage.getItem("refresh_token");
            const response = await axios.get(`${URL_SERVER}/get-course-content/${data._id}`, {
                headers: {
                    "access-token": accessToken,
                    "refresh-token": refreshToken
                }
            })
            setIsLoading(false);
            setCourseContentData(response.data.content);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            router.push("/(routes)/course-details");
        }
    }

    const OnHandleQuestionSubmit = async () => {
        try {
            const accessToken = await AsyncStorage.getItem("access_token");
            const refreshToken = await AsyncStorage.getItem("refresh_token");
            await axios.put(`${URL_SERVER}/add-question`, {
                question: question,
                courseId: data._id,
                contentId: courseContentData[activeVideo]._id
            }, {
                headers: {
                    "access-token": accessToken,
                    "refresh-token": refreshToken
                }
            });
            setQuestion("");
            Toast.show("Câu hỏi đã tạo mới thành công!", {
                placement: "bottom",
                type: "success"
            });
            await FetchCourseContent();
        } catch (error) {
            console.log(error);
        }
    }

    const OnHandleReviewSubmit = async () => {
        try {
            const accessToken = await AsyncStorage.getItem("access_token");
            const refreshToken = await AsyncStorage.getItem("refresh_token");
            await axios.put(`${URL_SERVER}/add-review/${data._id}`,
                { review, rating },
                {
                    headers: {
                        "access-token": accessToken,
                        "refresh-token": refreshToken
                    }
                }
            );
            setRating(1);
            setReview("");
            let currentCourseReview = courseReviews;
            let _data: ReviewType = {
                user: user!,
                comment: review,
                rating: rating
            }
            currentCourseReview = [_data, ...currentCourseReview];
            setCourseReviews(currentCourseReview);
        } catch (error) {
            console.log(error);
        }
    }

    const RenderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity key={i} onPress={() => setRating(i)}>
                    <FontAwesome
                        name={i <= rating ? "star" : "star-o"}
                        size={20}
                        color={"#FF8D07"}
                        style={{ marginHorizontal: 2, marginBottom: 10 }}
                    />
                </TouchableOpacity>
            )
        }
        return stars;
    }

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <ScrollView style={{ flex: 1, padding: 10 }}>
                    <View style={{ width: "100%", aspectRatio: 18 / 9, borderRadius: 10 }}>
                        <MuxVideo
                            style={{width: "100%", height: 200}}
                            source={{
                                uri:
                                    `https://stream.mux.com/${videoData.videoId}.m3u8?token=${token}`,
                                    //https://stream.mux.com/uLDvBCbsbbZKXHitkzvJ6DbQIrynoQ8j6BPD6OWk1iA.m3u8?token={JWT}
                            }}
                            controls
                            muted
                            muxOptions={{
                                application_name: app.expo.name,            // (required) the name of your application
                                application_version: app.expo.version,      // the version of your application (optional, but encouraged)
                                data: {
                                    env_key: '8m01he8sfkme3cie3juold22i',     // (required)
                                    video_id: videoData.id,             // (required)
                                    video_title: 'My awesome video',
                                    player_software_version: '5.0.2',     // (optional, but encouraged) the version of react-native-video that you are using
                                    player_name: 'React Native Player',  // See metadata docs for available metadata fields https://docs.mux.com/docs/web-integration-guide#section-5-add-metadata
                                },
                            }}
                        />
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: `${activeVideo === 0 ? '#ccc' : '#2467EC'}` }]}
                            disabled={activeVideo === 0}
                            onPress={() => setActiveVideo(activeVideo - 1)}
                        >
                            <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "600" }}>
                                {"Quay lại"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: `${(activeVideo === courseContentData.length - 1) ? '#ccc' : '#2467EC'}` }]}
                            disabled={activeVideo === courseContentData.length - 1}
                            onPress={() => setActiveVideo(activeVideo + 1)}
                        >
                            <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "600" }}>
                                {"Tiếp theo"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ paddingVertical: 10 }}>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                            {activeVideo + 1}. {courseContentData[activeVideo]?.title}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            marginTop: 10,
                            marginHorizontal: 0,
                            backgroundColor: "#E1E9F8",
                            borderRadius: 50,
                            gap: 10,
                            justifyContent: "space-between"
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                paddingVertical: 10,
                                paddingHorizontal: 36,
                                backgroundColor: activeButton === "About" ? "#2467EC" : "transparent",
                                borderRadius: activeButton === "About" ? 50 : 0
                            }}
                            onPress={() => setActiveButton("About")}
                        >
                            <Text
                                style={{
                                    color: activeButton === "About" ? "#FFF" : "#000",
                                    fontFamily: "Nunito_600SemiBold"
                                }}
                            >
                                Chi tiết
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                paddingVertical: 10,
                                paddingHorizontal: 36,
                                borderRadius: activeButton === "Q&A" ? 50 : 0,
                                backgroundColor: activeButton === "Q&A" ? "#2467EC" : "transparent"
                            }}
                            onPress={() => setActiveButton("Q&A")}
                        >
                            <Text
                                style={{
                                    color: activeButton === "Q&A" ? "#FFF" : "#000",
                                    fontFamily: "Nunito_600SemiBold"
                                }}
                            >
                                Hỏi đáp
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                paddingVertical: 10,
                                paddingHorizontal: 30,
                                borderRadius: activeButton === "Reviews" ? 50 : 0,
                                backgroundColor: activeButton === "Reviews" ? "#2467EC" : "transparent"
                            }}
                            onPress={() => setActiveButton("Reviews")}
                        >
                            <Text
                                style={{
                                    color: activeButton === "Reviews" ? "#FFF" : "#000",
                                    fontFamily: "Nunito_600SemiBold"
                                }}
                            >
                                Đánh giá
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {activeButton === "About" && (
                        <View
                            style={{
                                marginHorizontal: 10,
                                marginVertical: 25,
                                paddingHorizontal: 0
                            }}
                        >
                            <Text style={{ fontSize: 18, fontFamily: "Raleway_700Bold" }}>
                                Tham khảo
                            </Text>
                            {courseContentData[activeVideo]?.links.map((link: LinkType, index: number) => (
                                <View
                                    key={`indexavjkahfkahkas-${index}`}
                                    style={{
                                        width: "100%",
                                        flexDirection: "row",
                                        gap: 10,
                                        alignItems: "center"
                                    }}>
                                    <Text
                                        style={{
                                            color: "#525258",
                                            fontSize: 16,
                                            marginTop: 10,
                                            textAlign: "justify",
                                            fontFamily: "Nunito_500Medium"
                                        }}
                                    >
                                        {link.title}
                                    </Text>
                                    <Text
                                        style={{
                                            color: "#525258",
                                            fontSize: 16,
                                            marginTop: 10,
                                            textAlign: "justify",
                                            fontFamily: "Nunito_500Medium"
                                        }}
                                    >
                                        {link.url}
                                    </Text>
                                </View>
                            ))}
                            <Text
                                style={{
                                    color: "#525258",
                                    fontSize: 16,
                                    marginTop: 10,
                                    textAlign: "justify",
                                    fontFamily: "Nunito_500Medium"
                                }}
                            >
                            </Text>
                            <TouchableOpacity
                                onPress={() => router.push({
                                    pathname: '/course-quizz',
                                    params: {
                                        courseData: courseData,
                                        activeVideo: activeVideo,
                                        id: data._id
                                    }
                                })}
                                style={{
                                    height: 30,
                                    width: 100,
                                    backgroundColor: '#0085ff',
                                    borderRadius: 4,
                                    borderColor: 'transparent',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                >
                                        <Text
                                            style={{
                                                color: "white",
                                                fontSize: 16,
                                                textAlign: "justify",
                                                fontFamily: "Nunito_500Medium"
                                            }}
                                        >
                                            Kiểm tra
                                        </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {activeButton === "Q&A" && (
                        <View style={{ flex: 1 }}>
                            <View>
                                <TextInput
                                    value={question}
                                    onChangeText={(v) => setQuestion(v)}
                                    placeholder="Đặt câu hỏi..."
                                    style={{
                                        marginVertical: 20,
                                        flex: 1,
                                        textAlignVertical: "top",
                                        justifyContent: "flex-start",
                                        backgroundColor: "#FFF",
                                        borderRadius: 10,
                                        height: 100,
                                        padding: 10
                                    }}
                                    multiline
                                />
                                <View
                                    style={{ flexDirection: "row", justifyContent: "flex-end" }}
                                >
                                    <TouchableOpacity
                                        style={styles.button}
                                        disabled={question === ""}
                                        onPress={() => OnHandleQuestionSubmit()}
                                    >
                                        <Text
                                            style={{ color: "#FFF", fontSize: 16, fontWeight: "600" }}
                                        >
                                            Gửi câu hỏi
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ marginBottom: 20 }}>
                                {courseContentData[activeVideo]?.questions
                                    ?.slice()
                                    ?.reverse()
                                    .map((item: CommentType, index: number) => (
                                        <View key={`${index}-f`}>
                                            <QuestionsCard
                                                item={item}
                                                fetchCourseContent={FetchCourseContent}
                                                courseData={data}
                                                contentId={courseContentData[activeVideo]?._id}
                                            />
                                        </View>
                                    ))}
                            </View>
                        </View>
                    )}
                    {activeButton === "Reviews" && (
                        <View style={{ marginHorizontal: 5, marginVertical: 25 }}>
                            {!reviewAvailable && (
                                <View>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                paddingBottom: 10,
                                                paddingLeft: 2,
                                                paddingRight: 5
                                            }}
                                        >
                                            Đưa ra đánh giá:
                                        </Text>
                                        {RenderStars()}
                                    </View>
                                    <TextInput
                                        value={review}
                                        onChangeText={(v) => setReview(v)}
                                        placeholder="Đưa ra đánh giá..."
                                        style={{
                                            flex: 1,
                                            textAlignVertical: "top",
                                            justifyContent: "flex-start",
                                            backgroundColor: "white",
                                            borderRadius: 10,
                                            height: 100,
                                            padding: 10
                                        }}
                                        multiline
                                    />
                                    <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                        <TouchableOpacity
                                            style={styles.button}
                                            disabled={review === ""}
                                            onPress={() => OnHandleReviewSubmit()}
                                        >
                                            <Text
                                                style={{
                                                    color: "#FFF",
                                                    fontSize: 16,
                                                    fontWeight: "600"
                                                }}
                                            >
                                                Gửi Đánh giá
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                            <View style={{ rowGap: 25 }}>
                                {courseReviews.map((item: ReviewType, index: number) => (
                                    <View key={`${index}-efa`}>
                                        <ReviewCard item={item} />
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </ScrollView >
            )}
        </>
    )
}

export default CourseAccessScreen;