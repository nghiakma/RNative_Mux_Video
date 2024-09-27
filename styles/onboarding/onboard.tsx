import { StyleSheet } from "react-native";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";

export const styles = StyleSheet.create({
    firstContainer: {
        alignItems: "center",
        marginTop: 50,
    },
    logo: {
        width: wp("23%"),
        height: hp("10%")
    },
    titleWrapper: {
        flexDirection: "row"
    },
    titleTextShape1: {
        position: "absolute",
        top: -20,
        left: -28
    },
    titleTextShape2: {
        position: "absolute",
        top: -20,
        right: -70
    },
    titleTextShape3: {
        position: "absolute",
        left: 60
    },
    titleText: {
        fontSize: hp("2.6%"),
        textAlign: "center"
    },
    descWrapper: {
        marginTop: 30
    },
    descText: {
        color: "#575757",
        fontSize: hp("1.8%"),
        textAlign: "center"
    },

    buttonWrapper: {
        backgroundColor: "#2467EC",
        width: wp("88%"),
        paddingVertical: 18,
        borderRadius: 4,
        marginTop: 40
    },
    buttonText: {
        color: "#fff",
        textAlign: "center"
    },
    welcomeButtonStyle: {
        backgroundColor: "#2467EC",
        width: responsiveWidth(88),
        height: responsiveHeight(5.5),
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
    }
})