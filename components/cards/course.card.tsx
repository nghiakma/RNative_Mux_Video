import { AntDesign, FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import * as Progress from "react-native-progress";
import { useDispatch, useSelector } from "react-redux";
import * as userActions from "../../utils/store/actions/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { URL_IMAGES, URL_SERVER } from "@/utils/url";

export default function CourseCard({ item }: { item: CoursesType }) {
    const [showProgress, setShowProgress] = useState(false);
    const [progressFill, setProgressFill] = useState(0);
    const progresses = useSelector((state: any) => state.user.progress);
    const [wishState, setWishState] = useState(false);
    const wishList = useSelector((state: any) => state.user.wishList);
    const [idWishCourse, setIdWishCourse] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        const isWished = wishList.find((_item: any) => _item.courseId === item._id);
        if(isWished){
            setWishState(true);
            setIdWishCourse(isWished._id);
        }else{
            setWishState(false);
            setIdWishCourse('');
        }
    }, [wishList])

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
        let progressBarValue = progress.progress;
        setProgressFill(progressBarValue);
    }

    const getProgressColor = () => {
        let progress: number = progressFill;//chi lay tu 0-1
        return progress < 0.5 ? '#1c86b7' : '#237867';
    }

    const onAddToWishList = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('access_token');
            const refreshToken = await AsyncStorage.getItem('refresh_token');
            const response = await axios.post(`${URL_SERVER}/wishlist`, {
                courseId: item._id
            }, {
                headers: {
                    'access-token': accessToken,
                    'refresh-token': refreshToken
                }
            });
            const data = {
                _id: response.data.data._id,
                userId: response.data.userId,
                courseId: item._id
            }
            dispatch(userActions.pushWishCourse(data));
        } catch (error) {
            console.log(error);
        }
    }

    const onRemoveFromWishList = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('access_token');
            const refreshToken = await AsyncStorage.getItem('refresh_token');
            await axios.delete(`${URL_SERVER}/wishlist?id=${idWishCourse}`, {
                headers: {
                    'access-token': accessToken,
                    'refresh-token': refreshToken
                }
            });
            const data = {
                _id: idWishCourse,
            }
            dispatch(userActions.removeWishCourse(data));
            setWishState(false);
        } catch (error) {
            console.log(error);
        }
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
            <View style={{ paddingHorizontal: 10, marginHorizontal: "auto", position: 'relative' }}>
                <Image
                    style={{
                        width: wp(80),
                        height: 200,
                        borderRadius: 5,
                        alignSelf: "center",
                        objectFit: "cover",
                    }}
                    source={{ uri: `${URL_IMAGES}/${item.thumbnail?.url}`}}
                />
                <View 
                    style={{
                        position:'absolute',
                        zIndex: 9999,
                        top: 10,
                        right: 10
                    }}
                >
                    { !wishState && (
                        <TouchableOpacity
                            onPress={() => onAddToWishList()}
                            style={styles.wishBtn}
                        >
                            <AntDesign name="hearto" size={18} color="white" />
                        </TouchableOpacity>
                    )}
                    { wishState && (
                        <TouchableOpacity
                            onPress={() => onRemoveFromWishList()}
                            style={styles.wishBtn}
                        >
                            <AntDesign name="heart" size={18} color="rgba(255, 0, 0, 0.6)" />
                        </TouchableOpacity>
                    )}
                </View>
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
                            progress={progressFill}
                            width={wp(80)}
                            color={getProgressColor()}
                        />
                        <Text 
                            style={{
                                color: getProgressColor()
                            }}
                        >
                            Hoàn thành {Math.round(progressFill * 100)}%
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

    wishBtn:{
        borderRadius: 12,
        width: 42,
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(250, 202, 30, 0.8)'
    }
});