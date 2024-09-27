import { commonStyles } from "@/styles/common/common.styles";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const styles = StyleSheet.create({

});

const CustomButton = ({ title, onPress }: { title: string, onPress: () => void }) => {
    const { width } = Dimensions.get("window");
    return (
        <TouchableOpacity
            style={[
                commonStyles.buttonContainer, {
                    width: width - 320,
                    height: 40,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    backgroundColor: "#0070f3"
                }
            ]}
            onPress={() => onPress()}
        >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>{title}</Text>
        </TouchableOpacity>
    )
}

export default CustomButton;