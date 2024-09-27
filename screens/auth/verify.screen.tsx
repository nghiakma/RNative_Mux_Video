import CustomButton from "@/components/custom_button";
import { URL_SERVER } from "@/utils/url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import React, { useRef, useState } from "react"
import { Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Toast } from "react-native-toast-notifications";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    headerText: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subText: {
        fontSize: 16,
        color: "#666",
        marginBottom: 20,
        textAlign: "center",
    },
    inputContainer: {
        flexDirection: "row",
        marginBottom: 20,
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 12
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
    loginLink: {
        flexDirection: "row",
        marginTop: 30,
    },
    loginText: {
        color: "#3876EE",
        marginLeft: 5,
        fontSize: 16,
    },
    backText: { fontSize: 16 },
});

const VerifyAccountScreen = () => {
    const [code, setCode] = useState(new Array(4).fill(""));
    const inputs = useRef<any>([...Array(4)].map(() => React.createRef()));

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

    const OnHandleSubmit = async () => {
        const otp = code.join("");
        const activation_token = await AsyncStorage.getItem("activation_token");
        try {
            const response = await axios.post(`${URL_SERVER}/activate-user`, {
                activation_token,
                activation_code: otp
            });
            Toast.show("Tài khoản của bạn đã được kích hoạt thành công!", {
                type: "success"
            });
            setCode(new Array(4).fill(""));
            router.push("/(routes)/sign-in");
        } catch (error) {
            console.log(error);
            Toast.show("Mã OTP của bạn không hợp lệ hoặc đã quá hạn!", {
                type: "danger"
            })
        }
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={[styles.container]}>
                <Text style={styles.headerText}>Kích hoạt tài khoản</Text>
                <Text style={styles.subText}>
                    Chúng tôi đã gửi mã kích hoạt tới địa chỉ email của bạn
                </Text>
                <View style={styles.inputContainer}>
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
                    <CustomButton title="Submit" onPress={() => OnHandleSubmit()} />
                </View>
                <View style={styles.loginLink}>
                    <Text style={[styles.backText, { fontFamily: "Nunito_700Bold" }]}>
                        Quay lại?
                    </Text>
                    <TouchableOpacity onPress={() => router.push("/(routes)/sign-in")}>
                        <Text style={[styles.loginText, { fontFamily: "Nunito_700Bold" }]}>
                            Đăng nhập
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default VerifyAccountScreen;