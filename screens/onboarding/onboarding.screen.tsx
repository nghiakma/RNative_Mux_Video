import { styles } from "@/styles/onboarding/onboard";
import { Nunito_400Regular, Nunito_700Bold } from "@expo-google-fonts/nunito";
import { Raleway_700Bold } from "@expo-google-fonts/raleway";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native"

const OnBoardingScreen = () => {
    let [fontsLoaded, fontError] = useFonts({
        Raleway_700Bold,
        Nunito_400Regular,
        Nunito_700Bold
    })
    if (!fontsLoaded && !fontError) {
        return null;
    }
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <View style={styles.firstContainer}>
                <View>
                    <Image
                        source={require("@/assets/images/onboarding/logo.png")}
                        style={styles.logo}
                    />
                    <Image
                        source={require("@/assets/images/onboarding/shape_9.png")}
                    />
                </View>
                <View style={styles.titleWrapper}>
                    <Image
                        style={styles.titleTextShape1}
                        source={require("@/assets/images/onboarding/shape_3.png")}
                    />
                    <Text style={[styles.titleText, { fontFamily: "Raleway_700Bold" }]}>
                        Bắt Đầu Học Với
                    </Text>
                    <Image
                        style={styles.titleTextShape2}
                        source={require("@/assets/images/onboarding/shape_2.png")}
                    />
                </View>
                <View>
                    <Image
                        style={styles.titleTextShape3}
                        source={require("@/assets/images/onboarding/shape_6.png")}
                    />
                    <Text style={[styles.titleText, { fontFamily: "Raleway_700Bold" }]}>Ứng Dụng Học Tập Trực Tuyến</Text>
                </View>
                <View style={styles.descWrapper}>
                    <Text style={[styles.descText, { fontFamily: "Nunito_400Regular" }]}>
                        Khám phá nhiều bài học tương tác, video,
                    </Text>
                    <Text style={[styles.descText, { fontFamily: "Nunito_400Regular" }]}>
                        các câu hỏi thú vị và bài tập
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.buttonWrapper}
                    onPress={() => router.push("/(routes)/welcome-intro")}
                >
                    <Text
                        style={[styles.buttonText, { fontFamily: "Nunito_700Bold" }]}
                    >
                        Bắt tay vào khám phá
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default OnBoardingScreen;