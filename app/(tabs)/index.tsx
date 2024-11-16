import HomeScreen from "@/screens/home/home.screen";
import * as userActions from "../../utils/store/actions/index";
import { useEffect, useState } from "react";
import { URL_SERVER } from "@/utils/url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useDispatch } from "react-redux";
import Loader from "@/components/loader";
import { router } from "expo-router";

const index = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [token, setToken] = useState({
        access: '',
        refresh: ''
    });

    useEffect(() => {
        setLoading(true);
        fetchWishListOfUser();
        fetchUserInfo();
    }, [])

    const fetchWishListOfUser = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('access_token');
            const refreshToken = await AsyncStorage.getItem('refresh_token');
            
            const response = await axios.get(`${URL_SERVER}/wishlist`, {
                headers: {
                    'access-token': accessToken,
                    'refresh-token': refreshToken
                }
            });
            if(response.data && response.data.data){
                const _wishList = response.data.data.map((item: any) => ({
                    _id: item._id,
                    courseId: item.courseId,
                    userId: item.userId
                }));
                dispatch(userActions.saveWishList(_wishList));
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchUserInfo = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('access_token');
            const refreshToken = await AsyncStorage.getItem('refresh_token');
            const response = await axios.get(`${URL_SERVER}/me`, {
                headers: {
                    'access-token': accessToken,
                    'refresh-token': refreshToken
                }
            });
            if(response.data){
                const {_id, name, email, avatar} = response.data.user;
                let payload = {
                    _id, name, email, avatarUrl: avatar?.url
                };
                dispatch(userActions.saveUserInfo(payload));
            }else{
                console.log("Không tìm thấy người dùng");
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            // router.push("/(routes)/sign-in");
        }finally{
            setLoading(false);
        }
    }

    return (
        <>
            {loading ? (
                <Loader />
            ):(
                <HomeScreen />
            )}
        </>
    )
}

export default index;