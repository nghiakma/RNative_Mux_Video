import { commonStyles } from "@/styles/common/common.styles";
import { URL_SERVER } from "@/utils/url";
import { Nunito_400Regular, Nunito_500Medium, Nunito_700Bold, Nunito_600SemiBold } from "@expo-google-fonts/nunito";
import { Raleway_600SemiBold, Raleway_700Bold } from "@expo-google-fonts/raleway";
import { AntDesign, Fontisto, Entypo, Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Toast } from "react-native-toast-notifications";
import SignUpImage from "@/assets/images/sign-in/sign-up.png";
import CustomButton from "@/components/custom_button";

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
    inputBox: {
        width: 60,
        height: 60,
        borderWidth: 1,
        borderColor: "#ddd",
        textAlign: "center",
        marginRight: 10,
        borderRadius: 10,
        fontSize: 20,
    },
    inputContainerOTP: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
    }
});

const ForgotPasswordScreen = () => {
    const [code, setCode] = useState(new Array(4).fill(""));
    const inputs = useRef<any>([...Array(4)].map(() => React.createRef()));
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
    const [isSubmitAccount, setIsSubmitAccount] = useState(false);
    const [otpScreen, setOtpScreen] = useState(false);
    const [isSubmitOtp, setIsSubmitOtp] = useState(false);

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

    const handleInput = (text: any, index: any) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        if (text && index < 3) {
            inputs.current[index + 1].current.focus();
        }

        if (text === "" && index > 0) {
            inputs.current[index - 1].current.focus();
        }
    }

    const onGetOTP = async () => {
        try {
            
            setIsSubmitAccount(true);
            setOtpScreen(true);
        } catch (error) {
            console.log(error);
        }
    }

    const OnHandleOTP = async () => {
        const otp = code.join("");
        const activation_token = await AsyncStorage.getItem("activation_token");
        try {
            // const response = await axios.post(`${URL_SERVER}/activate-user`, {
            //     activation_token,
            //     activation_code: otp
            // });
            Toast.show("Tài khoản của bạn đã được kích hoạt thành công!", {
                type: "success"
            });
            setCode(new Array(4).fill(""));
            router.push("/(routes)/reset-password");
        } catch (error) {
            console.log(error);
            Toast.show("Mã OTP của bạn không hợp lệ hoặc đã quá hạn!", {
                type: "danger"
            })
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
                <Image
                    style={styles.signInImage}
                    source={SignUpImage}
                />
                {!otpScreen ? (
                    <>
                        <Text style={[styles.welcomeText, { fontFamily: "Raleway_700Bold" }]}>
                            Quên mật khẩu?
                        </Text>
                        <Text style={styles.learningText}>
                            Nhập địa chỉ email
                        </Text>
                    </>
                ):(
                    <>
                        <Text style={[styles.welcomeText, { fontFamily: "Raleway_700Bold" }]}>
                            Xác thực người dùng
                        </Text>
                        <Text style={styles.learningText}>
                            Nhập mã OTP của bạn
                        </Text>
                    </>
                )}
                {isSubmitAccount === false && (
                    <View style={styles.inputContainer}>
                        <View>
                            <TextInput
                                style={[styles.input, { paddingLeft: 40 }]}
                                keyboardType="default"
                                value={userInfo.name}
                                placeholder="Nhập tên tài khoản"
                                onChangeText={(v) => setUserInfo({ ...userInfo, name: v })}
                            />
                            <Fontisto
                                style={{ position: "absolute", top: 17.3, left: 26 }}
                                name="email"
                                size={20}
                                color={"#A1A1A1"}
                            />
                        </View>          
                        <TouchableOpacity
                            style={{
                                padding: 16,
                                borderRadius: 8,
                                marginHorizontal: 16,
                                backgroundColor: "#2467EC",
                            }}
                            onPress={() => onGetOTP()}
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
                                    Nhận OTP
                                </Text>
                            )}
                        </TouchableOpacity>
                        <View style={styles.signupRedirect}>
                            <TouchableOpacity onPress={() => router.push("/(routes)/sign-in")}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontFamily: "Raleway_600SemiBold",
                                        color: "#2467EC",
                                    }}
                                >
                                    Quay lại
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                { otpScreen && (
                    <View style={styles.inputContainer}>
                        <View style={styles.inputContainerOTP}>
                            {code.map((_, index) => (
                                <TextInput
                                    key={index}
                                    style={styles.inputBox}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    onChangeText={(text) => handleInput(text, index)}
                                    value={code[index]}
                                    ref={inputs.current[index]}
                                    autoFocus={index === 0}
                                />
                            ))}
                        </View>
                        <View style={{ marginTop: 10, justifyContent: "center", alignItems: "center" }} >
                            <CustomButton title="Xác nhận" onPress={() => OnHandleOTP()} />
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default ForgotPasswordScreen;