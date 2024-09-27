import AllCourses from "@/components/all-courses";
import HeaderComponent from "@/components/header";
import HomeBannerSlider from "@/components/home-banner-slider";
import SearchInput from "@/components/search.input";
import { ScrollView, Text, View } from "react-native"

const HomeScreen = () => {
    return (
        <View style={{ flex: 1 }}>
            <HeaderComponent />
            <SearchInput homeScreen={true} />
            <ScrollView showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
            >
                <HomeBannerSlider />
                <AllCourses />
            </ScrollView>
        </View>
    )
}

export default HomeScreen;