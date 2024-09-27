import { Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold } from "@expo-google-fonts/nunito";
import { Raleway_600SemiBold, Raleway_700Bold } from "@expo-google-fonts/raleway";
import { useFonts } from "expo-font";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SignInImage from "../../assets/images/sign-in/sign-in.png";
import SignUpImage from "../../assets/images/sign-in/sign-up.png";
import { Entypo, FontAwesome, Fontisto, Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { commonStyles } from "@/styles/common/common.styles";
import { useState } from "react";
import { router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "react-native-toast-notifications";
import { URL_SERVER } from "@/utils/url";

const styles = StyleSheet.create({
    signInImage: {
        width: "60%",
        height: 250,
        alignSelf: "center",
        marginTop: 50,
    },
    welcomeText: {
        textAlign: "center",
        fontSize: 24,
    },
    learningText: {
        textAlign: "center",
        color: "#575757",
        fontSize: 15,
        marginTop: 5,
    },
    inputContainer: {
        marginHorizontal: 16,
        marginTop: 30,
        rowGap: 30,
    },
    input: {
        height: 55,
        marginHorizontal: 16,
        borderRadius: 8,
        paddingLeft: 35,
        fontSize: 16,
        backgroundColor: "white",
        color: "#A1A1A1",
    },
    visibleIcon: {
        position: "absolute",
        right: 30,
        top: 15,
    },
    icon2: {
        position: "absolute",
        left: 23,
        top: 17.8,
        marginTop: -2,
    },
    forgotSection: {
        marginHorizontal: 16,
        textAlign: "right",
        fontSize: 16,
        marginTop: 10,
    },
    signUpRedirect: {
        flexDirection: "row",
        marginHorizontal: 16,
        justifyContent: "center",
        marginBottom: 20,
        marginTop: 20,
    },
});

const SignInScreen = () => {
    const URL_SERVER_ENV = process.env.EXPO_PUBLIC_URL_SERVER;
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [buttonSpinner, setButtonSpinner] = useState(false);
    const [userInfo, setUserInfo] = useState({
        email: "",
        password: ""
    });
    const [required, setRequired] = useState("");
    const [error, setError] = useState({
        password: ""
    })

    const handlePasswordValidation = (value: string) => {
        const password = value;
        const passwordOneNumber = /(?=.*[0-9])/;
        const passwordThreeValue = /(?=.{6,})/;

        if (!passwordOneNumber.test(password)) {
            setError({
                ...error,
                password: "Mật khẩu phải có ít nhất một ký tự số 0-9"
            });
            setUserInfo({ ...userInfo, password: "" });
            return false;
        } else if (!passwordThreeValue.test(password)) {
            setError({
                ...error,
                password: "Mật khẩu phải có độ dài 3 ký tự trở lên"
            });
            setUserInfo({ ...userInfo, password: "" });
            return false;
        }
        setError({
            ...error,
            password: ""
        });

        return true;
    }

    const OnHandleSignIn = async () => {
        setButtonSpinner(true);
        const isValid = handlePasswordValidation(userInfo.password);
        try {
            let { email, password } = userInfo;
            if (isValid) {
                const response = await axios.post(`${URL_SERVER}/login`, {
                    email: email,
                    password: password
                });
                await AsyncStorage.setItem("access_token", response.data.accessToken);
                await AsyncStorage.setItem("refresh_token", response.data.refreshToken);
                Toast.show("Đăng nhập thành công", {
                    type: "success"
                });

                router.push("/(tabs)");
            }
        } catch (error) {
            console.log(error);
            Toast.show("Email hoặc mật khâu không chính xác!", {
                type: "danger"
            });
        } finally {
            setButtonSpinner(false);
        }
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
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
                <Image
                    style={styles.signInImage}
                    source={SignInImage}
                />
                <Text style={[styles.welcomeText, { fontFamily: "Raleway_700Bold" }]}>
                    Xìn chào!
                </Text>
                <Text style={styles.learningText}>
                    Đăng nhập vào tài khoản của bạn tại ứng dụng
                </Text>
                <View style={styles.inputContainer}>
                    <View>
                        <TextInput
                            style={[styles.input, { paddingLeft: 40 }]}
                            keyboardType="email-address"
                            placeholder="Nhập địa chỉ email"
                            value={userInfo.email}
                            onChangeText={(v) => setUserInfo({ ...userInfo, email: v })}
                        />
                        <Fontisto
                            style={{ position: "absolute", left: 26, top: 17.6 }}
                            name="email"
                            size={20}
                            color={"#A1A1A1"}
                        />
                        {
                            required && (
                                <View style={commonStyles.errorContainer}>
                                    <Entypo name="cross" size={18} color={"red"} />
                                </View>
                            )
                        }
                    </View>
                    <View>
                        <View style={{ marginTop: 15 }}>
                            <TextInput
                                style={commonStyles.input}
                                keyboardType="default"
                                secureTextEntry={!isPasswordVisible}
                                defaultValue=""
                                placeholder="**********"
                                value={userInfo.password}
                                onChangeText={(v) => setUserInfo({ ...userInfo, password: v })}
                            />
                            <TouchableOpacity
                                style={styles.visibleIcon}
                                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                            >
                                {
                                    isPasswordVisible ?
                                        (
                                            <Ionicons
                                                name="eye-off-outline"
                                                size={23}
                                                color={"#747474"}
                                            />
                                        )
                                        :
                                        (
                                            <Ionicons
                                                name="eye-outline"
                                                size={23}
                                                color={"#747474"}
                                            />
                                        )

                                }
                            </TouchableOpacity>
                            <SimpleLineIcons
                                style={styles.icon2}
                                name="lock"
                                size={20}
                                color={"#A1A1A1"}
                            />
                        </View>
                        {error.password !== '' && (
                            <View style={[commonStyles.errorContainer, { top: 82 }]}>
                                <Entypo name="cross" size={18} color={"red"} />
                                <Text style={{ color: "red", fontSize: 11, marginTop: -1 }}>
                                    {error.password}
                                </Text>
                            </View>
                        )}
                        <TouchableOpacity>
                            <Text
                                style={[
                                    styles.forgotSection,
                                    { fontFamily: "Nunito_600SemiBold" },
                                ]}
                            >
                                Quên mật khẩu?
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                padding: 16,
                                borderRadius: 8,
                                marginHorizontal: 16,
                                backgroundColor: "#2467EC",
                                marginTop: 15
                            }}
                            onPress={() => OnHandleSignIn()}
                        >
                            {buttonSpinner ? (
                                <ActivityIndicator size="small" color={"#fff"} />
                            ) : (
                                <Text
                                    style={{
                                        color: "#fff",
                                        textAlign: "center",
                                        fontSize: 16,
                                        fontFamily: "Raleway_700Bold"
                                    }}
                                >
                                    Đăng nhập
                                </Text>
                            )}
                        </TouchableOpacity>
                        <View style={styles.signUpRedirect}>
                            <Text style={{ fontSize: 18, fontFamily: "Raleway_600SemiBold" }}>
                                Không có tài khoản?
                            </Text>
                            <TouchableOpacity
                                onPress={() => router.push("/(routes)/sign-up")}
                            >
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontFamily: "Raleway_600SemiBold",
                                        color: "#2467EC",
                                        marginLeft: 5,
                                    }}
                                >
                                    Đăng ký
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SignInScreen;