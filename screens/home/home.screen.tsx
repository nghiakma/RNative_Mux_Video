import AllCourses from "@/components/all-courses";
import HeaderComponent from "@/components/header";
import HomeBannerSlider from "@/components/home-banner-slider";
import SearchInput from "@/components/search.input";
import { URL_SERVER } from "@/utils/url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
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
                {/* <AllCourses progresses={progresses}/> */}
                <AllCourses/>
            </ScrollView>
        </View>
    )
}

export default HomeScreen;