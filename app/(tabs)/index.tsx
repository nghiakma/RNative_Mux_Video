import HomeScreen from "@/screens/home/home.screen";
import * as userActions from "../../utils/store/actions/index";
import { useEffect } from "react";
import { URL_SERVER } from "@/utils/url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useDispatch } from "react-redux";

const index = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        fetchWishListOfUser();
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
    return (
        <HomeScreen />
    )
}

export default index;