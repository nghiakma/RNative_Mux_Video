import AllCourses from "@/components/all-courses";
import HeaderComponent from "@/components/header";
import HomeBannerSlider from "@/components/home-banner-slider";
import SearchInput from "@/components/search.input";
import { ScrollView, Text, TouchableOpacity, View } from "react-native"

import {useDispatch, useSelector} from "react-redux";
import * as CounterActions from '../../utils/store/actions'

const HomeScreen = () => {
    const dispatch = useDispatch();
    const counter = useSelector((state: any) => state.counter);


    return (
        <View style={{ flex: 1 }}>
            <HeaderComponent />
            <SearchInput homeScreen={true} />
            <ScrollView showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
            >
                <HomeBannerSlider />
                <AllCourses/>
            </ScrollView>
        </View>
    )
}

export default HomeScreen;