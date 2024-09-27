import useUser from "@/hooks/useUser";
import { Tabs } from "expo-router";
import { Image } from "react-native";
import HouseSimpleIcon from "@/assets/images/icons/HouseSimple.png";
import SearchIcon from "@/assets/images/icons/search.png";
import BookBookmarkIcon from "@/assets/images/icons/BookBookmark.png";
import UserIcon from "@/assets/images/icons/User.png";
import { SafeAreaView } from "react-native-safe-area-context";
import { ToastProvider } from "react-native-toast-notifications";
const TabsLayout = () => {
    const { user } = useUser();

    return (
        <ToastProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <Tabs
                    screenOptions={({ route }) => {
                        return {
                            tabBarIcon: ({ color }) => {
                                let iconName;
                                if (route.name === "index") {
                                    iconName = HouseSimpleIcon;
                                } else if (route.name === "search/index") {
                                    iconName = SearchIcon;
                                } else if (route.name === "courses/index") {
                                    iconName = BookBookmarkIcon;
                                } else if (route.name === "profile/index") {
                                    iconName = UserIcon;
                                }
                                return (
                                    <Image
                                        style={{ width: 25, height: 25, tintColor: color }}
                                        source={iconName}
                                    />
                                )
                            },
                            headerShown: false,
                            tabBarShowLabel: false
                        }
                    }}
                >
                    <Tabs.Screen name="index" />
                    <Tabs.Screen name="search/index" />
                    <Tabs.Screen name="courses/index" />
                    <Tabs.Screen name="profile/index" />
                </Tabs>
            </SafeAreaView>
        </ToastProvider>
    )
}

export default TabsLayout;