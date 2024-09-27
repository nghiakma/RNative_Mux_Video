import { View } from "react-native";
import AnimatedLoader from "react-native-animated-loader";
const Loader = () => {
    return (
        <AnimatedLoader
            visible={true}
            overlayColor="rgba(255,255,255,0.75)"
            source={require("@/assets/animation/Online data Manager.json")}
            animationStyle={{ width: 250, height: 250 }}
            speed={1}
        />
    )
}

export default Loader;