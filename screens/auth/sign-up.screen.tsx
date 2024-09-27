import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useFonts } from "expo-font";
import { Raleway_600SemiBold, Raleway_700Bold } from "@expo-google-fonts/raleway";
import { Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold } from "@expo-google-fonts/nunito";
import { useState } from "react";
import SignUpImage from "@/assets/images/sign-in/sign-up.png";
import { router } from "expo-router";
import { AntDesign, Entypo, Fontisto, Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { commonStyles } from "@/styles/common/common.styles";
import { Toast } from "react-native-toast-notifications";
import axios from "axios";
import { URL_SERVER } from "@/utils/url";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    signupRedirect: {
        flexDirection: "row",
        marginHorizontal: 16,
        justifyContent: "center",
        marginBottom: 20,
        marginTop: 20,
    },
});

const SignUpScreen = () => {

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [buttonSpinner, setButtonSpinner] = useState(false);
    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState({
        email: "",
        password: ""
    });

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

    const handleEmailValidation = (value: string): boolean => {
        let email = value;
        let regex = /^[a-zA-Z0-9]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(email)) {
            setError({
                ...error,
                email: "Địa chỉ email không hợp lệ"
            });

            setUserInfo({ ...userInfo, email: "", password: "" });
            return false;
        }
        setError({
            ...error,
            email: ""
        });

        return true;
    }

    const handlePasswordValidation = (value: string): boolean => {
        const password = value;
        const passwordOneNumber = /(?=.*[0-9])/;
        const passwordThreeValue = /(?=.{3,})/;

        if (!passwordOneNumber.test(password)) {
            setError({
                ...error,
                password: "Mật khẩu phải có tối thiểu 1 ký tự là số 0-9"
            });
            setUserInfo({ ...userInfo, password: "" });
            return false;
        } else if (!passwordThreeValue.test(password)) {
            setError({
                ...error,
                password: "Mật khẩu phải có độ dài tối thiểu là 3 ký tự bất kỳ"
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

    const OnHandleSignUp = async () => {
        setButtonSpinner(true);
        let { name, email, password } = userInfo;
        try {
            let isValidEmail = handleEmailValidation(email);
            let isValidPassword = handlePasswordValidation(password);
            if (isValidEmail && isValidPassword) {
                const response = await axios.post(`${URL_SERVER}/registration`, {
                    name: name,
                    email: email,
                    password: password
                });

                await AsyncStorage.setItem("activation_token", response.data.activationToken);
                Toast.show(response.data.message, {
                    type: 'success'
                });
                setUserInfo({ ...userInfo, name: "", email: "", password: "" });
                router.push("/(routes)/verify-account");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setButtonSpinner(false);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
                <Image
                    style={styles.signInImage}
                    source={SignUpImage}
                />
                <Text style={[styles.welcomeText, { fontFamily: "Raleway_700Bold" }]}>
                    Bắt đầu đăng ký nào!
                </Text>
                <Text style={styles.learningText}>
                    Tạo một tài khoản đăng nhập và trải nghiệm nhiều bài học thú vị
                </Text>
                <View style={styles.inputContainer}>
                    <View>
                        <TextInput
                            style={[styles.input, { paddingLeft: 40, marginBottom: 12 }]}
                            keyboardType="default"
                            value={userInfo.name}
                            placeholder="Nhập tên người dùng"
                            onChangeText={(v) => setUserInfo({ ...userInfo, name: v })}
                        />
                        <AntDesign
                            style={{ position: "absolute", left: 26, top: 17.3 }}
                            name="user"
                            size={20}
                            color={"#A1A1A1"}
                        />
                    </View>
                    <View>
                        <TextInput
                            style={[styles.input, { paddingLeft: 40 }]}
                            keyboardType="email-address"
                            value={userInfo.email}
                            placeholder="Nhập địa chỉ email"
                            onChangeText={(v) => setUserInfo({ ...userInfo, email: v })}
                        />
                        <Fontisto
                            style={{ position: "absolute", top: 17.6, left: 26 }}
                            name="email"
                            size={20}
                            color={"#A1A1A1"}
                        />
                        {error.email.length > 0 && (
                            <View style={[commonStyles.errorContainer, { top: 60 }]}>
                                <Entypo name="cross" size={18} color={"red"} />
                                <Text style={{ color: "red", fontSize: 11, marginTop: -1 }}>
                                    {error.email}
                                </Text>
                            </View>
                        )}
                    </View>
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
                            {isPasswordVisible ? (
                                <Ionicons
                                    name="eye-off-outline"
                                    size={23}
                                    color={"#747474"}
                                />
                            ) : (
                                <Ionicons name="eye-outline" size={23} color={"#747474"} />
                            )}
                        </TouchableOpacity>
                        <SimpleLineIcons
                            style={styles.icon2}
                            name="lock"
                            size={20}
                            color={"#A1A1A1"}
                        />
                        {error.password.length > 0 && (
                            <View style={[commonStyles.errorContainer, { top: 60 }]}>
                                <Entypo name="cross" size={18} color={"red"} />
                                <Text style={{ color: "red", fontSize: 11, marginTop: -1 }}>
                                    {error.password}
                                </Text>
                            </View>
                        )}
                    </View>
                    <TouchableOpacity
                        style={{
                            padding: 16,
                            borderRadius: 8,
                            marginHorizontal: 16,
                            backgroundColor: "#2467EC",
                            marginTop: 15,
                        }}
                        onPress={() => OnHandleSignUp()}
                    >
                        {buttonSpinner ? (
                            <ActivityIndicator size="small" color={"white"} />
                        ) : (
                            <Text
                                style={{
                                    color: "white",
                                    textAlign: "center",
                                    fontSize: 16,
                                    fontFamily: "Raleway_700Bold",
                                }}
                            >
                                Đăng ký
                            </Text>
                        )}
                    </TouchableOpacity>
                    <View style={styles.signupRedirect}>
                        <Text style={{ fontSize: 18, fontFamily: "Raleway_600SemiBold" }}>
                            Đã có tài khoản?
                        </Text>
                        <TouchableOpacity onPress={() => router.push("/(routes)/sign-in")}>
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontFamily: "Raleway_600SemiBold",
                                    color: "#2467EC",
                                    marginLeft: 5,
                                }}
                            >
                                Đăng nhập
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SignUpScreen;