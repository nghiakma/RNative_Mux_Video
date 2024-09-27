import { StyleSheet } from "react-native";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
export const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonContainer: {
        backgroundColor: "@2467EC",
        width: responsiveWidth(88),
        height: responsiveHeight(2.5),
        borderRadius: 5,
        marginHorizontal: 5
    },
    dotStyle: {
        borderRadius: 5,
        marginHorizontal: 5,
        height: responsiveHeight(2.5),
        width: responsiveWidth(2.5),
        backgroundColor: "#ccc"
    },
    activeDotStyle: {
        borderRadius: 5,
        marginHorizontal: 5,
        height: responsiveHeight(2.5),
        width: responsiveWidth(2.5),
        backgroundColor: "#2467Ec"
    },
    title: {
        fontSize: hp("2.5%"),
        textAlign: "center",
    },
    description: {
        fontSize: hp("1.8%"),
        color: "#575757",
        textAlign: "center",
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
    errorContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 16,
        position: "absolute",
        top: 60,
    },
})