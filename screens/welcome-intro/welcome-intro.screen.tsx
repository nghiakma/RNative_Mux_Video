import { Image, Text, View } from "react-native";
import {
    Nunito_400Regular,
    Nunito_600SemiBold
} from "@expo-google-fonts/nunito";
import { useFonts, Raleway_700Bold } from "@expo-google-fonts/raleway";
import AppIntroSlider from "react-native-app-intro-slider";
import { onboardingSwiperData } from "@/constants/constants";
import { router } from "expo-router";
import { commonStyles } from "@/styles/common/common.styles";
import { styles } from "@/styles/onboarding/onboard";
import { SafeAreaView } from "react-native-safe-area-context";
const WelcomeIntroScreen = () => {
    const [fontsLoaded, fontsError] = useFonts({
        Raleway_700Bold,
        Nunito_400Regular,
        Nunito_600SemiBold
    })

    if (!fontsLoaded && !fontsError) {
        return null;
    }

    const renderItem = ({ item }: { item: onboardingSwiperDataType }) => {
        return (
            <View style={{ flex: 1, paddingHorizontal: 16 }}>
                <Image
                    source={item.image}
                    style={{ alignSelf: "center", marginBottom: 30 }}
                />
                <Text style={[commonStyles.title, { fontFamily: "Raleway_700Bold" }]}>
                    {item.title}
                </Text>
                <View style={{ marginTop: 15 }}>
                    <Text
                        style={[
                            commonStyles.description,
                            { fontFamily: "Nunito_400Regular" },
                        ]}
                    >
                        {item.description}
                    </Text>
                    <Text
                        style={[
                            commonStyles.description,
                            { fontFamily: "Nunito_400Regular" },
                        ]}
                    >
                        {item.sortDescription}
                    </Text>
                    <Text
                        style={[
                            commonStyles.description,
                            { fontFamily: "Nunito_400Regular" },
                        ]}
                    >
                        {item.sortDescription2}
                    </Text>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <AppIntroSlider
                renderItem={renderItem}
                data={onboardingSwiperData}
                onDone={() => {
                    router.push("/(routes)/sign-in");
                }}
                onSkip={() => {
                    router.push("/(routes)/sign-in");
                }}
                renderNextButton={() => (
                    <View style={styles.welcomeButtonStyle}>
                        <Text
                            style={[styles.buttonText, { fontFamily: "Nunito_600SemiBold" }]}
                        >
                            Tiếp theo
                        </Text>
                    </View>
                )}
                renderDoneButton={() => (
                    <View style={styles.welcomeButtonStyle}>
                        <Text
                            style={[styles.buttonText, { fontFamily: "Nunito_600SemiBold" }]}
                        >
                            Bắt đầu
                        </Text>
                    </View>
                )}
                showSkipButton={false}
                dotStyle={commonStyles.dotStyle}
                bottomButton={true}
                activeDotStyle={commonStyles.activeDotStyle}
            />
        </SafeAreaView>
    )
}

export default WelcomeIntroScreen;