import useUser from "@/hooks/useUser";
import { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from "@expo-google-fonts/nunito";
import { Raleway_600SemiBold, Raleway_700Bold } from "@expo-google-fonts/raleway";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import { URL_SERVER } from "@/utils/url";
import Loader from "@/components/loader";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
const ProfileScreen = () => {
    const { user, loading, setRefetch } = useUser();
    const [image, setImage] = useState<any>(null);
    const [loader, setLoader] = useState(false);

    let [fontsLoaded, fontsError] = useFonts({
        Raleway_600SemiBold,
        Raleway_700Bold,
        Nunito_400Regular,
        Nunito_600SemiBold,
        Nunito_700Bold,
    });

    if (!fontsLoaded && !fontsError) {
        return null;
    }

    const OnLogoutHandler = async () => {
        await AsyncStorage.removeItem("access_token");
        await AsyncStorage.removeItem("refresh_token");
        await AsyncStorage.removeItem("cart");
        await AsyncStorage.removeItem("paymented");
        router.push("/(routes)/sign-in");
    }

    const OnPickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            setLoader(true);
            const base64Image = `data:image/jpeg;base64,${base64}`;
            setImage(base64Image);

            const accessToken = await AsyncStorage.getItem("access_token");
            const refreshToken = await AsyncStorage.getItem("refresh_token");

            try {
                const response = await axios.put(
                    `${URL_SERVER}/update-user-avatar`,
                    { avatar: base64Image },
                    {
                        headers: {
                            "access-token": accessToken,
                            "refresh-token": refreshToken
                        }
                    }
                );
                if (response.data) {
                    setRefetch(true),
                        setLoader(false);
                }
            } catch (error) {
                console.log(error);
                setLoader(false);
            }
        }
    }
    return (
        <>
            {loader || loading ? (
                <Loader />
            ) : (
                <SafeAreaView style={{ flex: 1 }}>
                    <ScrollView>
                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                            <View style={{ position: "relative" }}>
                                <Image
                                    source={{
                                        uri:
                                            image ||
                                            user?.avatar?.url ||
                                            "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png",
                                    }}
                                    style={{ width: 90, height: 90, borderRadius: 100 }}
                                />
                                <TouchableOpacity
                                    style={{
                                        position: "absolute",
                                        bottom: 5,
                                        right: 0,
                                        width: 30,
                                        height: 30,
                                        backgroundColor: "#f5f5f5",
                                        borderRadius: 100,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                    onPress={() => OnPickImage()}
                                >
                                    <Ionicons name="camera-outline" size={25} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text style={{ textAlign: "center", fontSize: 25, paddingTop: 10, fontWeight: "600" }}>
                            {user?.name}
                        </Text>
                        <View style={{ marginHorizontal: 16, marginTop: 30 }}>
                            <Text style={{ fontSize: 20, marginBottom: 16, fontFamily: "Raleway_700Bold" }}>
                                Thông tin tài khoản
                            </Text>
                            <TouchableOpacity
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: 20
                                }}

                            >
                                <View style={{ flexDirection: "row", alignItems: "center", columnGap: 30 }}>
                                    <View
                                        style={{
                                            borderWidth: 2,
                                            borderColor: "#DDE2EC",
                                            padding: 15,
                                            borderRadius: 100,
                                            width: 55,
                                            height: 55
                                        }}
                                    >
                                        <FontAwesome
                                            style={{ alignSelf: "center" }}
                                            name="user-o"
                                            size={20}
                                            color={"black"}
                                        />
                                    </View>
                                    <View>
                                        <Text style={{ fontSize: 16, fontFamily: "Nunito_700Bold" }}>
                                            Chi tiết hồ sơ
                                        </Text>
                                        <Text style={{ color: "#575757", fontFamily: "Nunito_400Regular" }}>
                                            Thông tin tài khoản
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity>
                                    <AntDesign name="right" size={26} color={"#CBD5E0"} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: 20
                                }}
                                onPress={() => router.push("/(routes)/enrolled-courses")}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        columnGap: 30
                                    }}
                                >
                                    <View
                                        style={{
                                            borderWidth: 2,
                                            borderColor: "#DDE2EC",
                                            padding: 15,
                                            borderRadius: 100,
                                            width: 55,
                                            height: 55
                                        }}
                                    >
                                        <MaterialCommunityIcons
                                            style={{ alignSelf: "center" }}
                                            name="book-account-outline"
                                            size={20}
                                            color={"black"}
                                        />
                                    </View>
                                    <View>
                                        <Text style={{ fontSize: 16, fontFamily: "Nunito_700Bold" }}>
                                            Các khóa học đã tham gia
                                        </Text>
                                        <Text style={{ color: "#575757", fontFamily: "Nunito_400Regular" }}>
                                            Toàn bộ các khóa học đã tham gia
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity>
                                    <AntDesign name="right" size={26} color={"#CBD5E0"} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: 20
                                }}
                                onPress={() => OnLogoutHandler()}
                            >
                                <View style={{ flexDirection: "row", alignItems: "center", columnGap: 30 }}>
                                    <View
                                        style={{
                                            borderWidth: 2,
                                            borderColor: "#DDE2EC",
                                            padding: 15,
                                            borderRadius: 100,
                                            width: 55,
                                            height: 55
                                        }}
                                    >
                                        <Ionicons
                                            style={{ alignSelf: "center" }}
                                            name="log-out-outline"
                                            size={20}
                                            color={"black"}
                                        />
                                    </View>
                                    <TouchableOpacity onPress={() => OnLogoutHandler()}>
                                        <Text style={{ fontSize: 16, fontFamily: "Nunito_700Bold" }}>
                                            Đăng xuất
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity>
                                    <AntDesign name="right" size={26} color={"#CBD5E0"} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            )}
        </>
    )
}

export default ProfileScreen;