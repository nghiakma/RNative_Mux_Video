import useUser from "@/hooks/useUser";
import { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from "@expo-google-fonts/nunito";
import { Raleway_600SemiBold, Raleway_700Bold } from "@expo-google-fonts/raleway";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import { URL_IMAGES, URL_SERVER, URL_VIDEO } from "@/utils/url";
import Loader from "@/components/loader";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import * as userActions from "../../utils/store/actions";
const InforScreen = () => {
    const [image, setImage] = useState<any>(null);
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user);
    const [userData, setUserData] = useState({
        name: '',
        email: ''
    });
    let [fontsLoaded, fontsError] = useFonts({
        Raleway_600SemiBold,
        Raleway_700Bold,
        Nunito_400Regular,
        Nunito_600SemiBold,
        Nunito_700Bold,
    });

    if (!fontsLoaded && !fontsError) {
        return null;
    }

    const GetProfileUser = async () => {
            //Thêm file ảnh vào form data
            const accessToken = await AsyncStorage.getItem("access_token");
            const refreshToken = await AsyncStorage.getItem("refresh_token");

            try {
                const response = await axios.get(
                    `${URL_SERVER}/me`,
             
                    {
                        headers: {
                            "access-token": accessToken,
                            "refresh-token": refreshToken
                        }
                    }
                );
                
                if (response.data) {
                    setUserData({
                        name: response.data.user.name,
                        email: response.data.user.email
                    });
                }
            } catch (error) {
                console.log(error);
                setLoader(false);
        }
    }

    useEffect(() => {
        setImage(user.userInfo.avatarUrl);
        GetProfileUser();
    }, [])
    return (
        <>
            {loader ? (
                <Loader />
            ) : (
                <SafeAreaView style={{ flex: 1, paddingTop: 40 }}>
                    <ScrollView>
                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                            <View style={{ position: "relative" }}>
                                <Image
                                    source={{
                                        uri: 
                                            `${URL_IMAGES}/${image}`
                                    }}
                                    style={{ width: 150, height: 150, borderRadius: 100 }}
                                />
                            </View>
                        </View>
                         {/* Thêm TextInput cho name và email */}
                         <View style={{ padding: 20 }}>
                            <TextInput
                                value={userData.name}
                                editable={false}
                                // onChangeText={(text) => setUserData(prev => ({...prev, name: text}))}
                                style={{
                                    height: 45,
                                    marginTop: 20,
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderRadius: 8,
                                    paddingHorizontal: 10,
                                    marginBottom: 15,
                                    fontSize: 16,
                                    fontFamily: 'Nunito_400Regular',
                                    color: '#000',
                                    backgroundColor: '#f5f5f5'
                                }}
                                placeholder="Tên người dùng"
                            />
                            <TextInput
                                value={userData.email}
                                editable={false}
                                // onChangeText={(text) => setUserData(prev => ({...prev, email: text}))}
                                style={{
                                    height: 45,
                                    borderWidth: 1,
                                    marginTop: 10,
                                    borderColor: '#ccc',
                                    borderRadius: 8,
                                    paddingHorizontal: 10,
                                    fontSize: 16,
                                    fontFamily: 'Nunito_400Regular',
                                    color: '#000',
                                    backgroundColor: '#f5f5f5'
                                }}
                                placeholder="Email"
                                keyboardType="email-address"
                            />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            )}
        </>
    )
}

export default InforScreen;