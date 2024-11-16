import CourseCard from "@/components/cards/course.card";
import CourseProgress from "@/components/cards/course.progress";
import Loader from "@/components/loader";
import useUser from "@/hooks/useUser";
import { URL_SERVER } from "@/utils/url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import * as Progress from "react-native-progress";
import {
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useSelector } from "react-redux";

const index = () => {
    const [loader, setLoader] = useState(false);
    const { loading } = useUser();
    const progresses = useSelector((state: any) => state.user.progress);

    return (
        <>
            {loader || loading ? (
                <Loader />
            ) : (
                <ScrollView style={{ flex: 1, paddingTop: 10 }}>
                    { progresses.length > 0 ? 
                        progresses.map((progress: any, index: number) => (
                            <View key={`${index}-umbala`} style={{marginBottom: 10}}>
                                <CourseProgress progress={progress}/>
                            </View>
                        ))
                        :
                        <View>
                            <Text>Không có dữ liệu</Text>
                        </View>
                    }
                </ScrollView>
            )}
        </>
    )
}

const styles = StyleSheet.create({})

export default index;