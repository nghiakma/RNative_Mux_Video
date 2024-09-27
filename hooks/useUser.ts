import { URL_SERVER } from "@/utils/url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react"

const useUser = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User>();
    const [error, setError] = useState("");
    const [refetch, setRefetch] = useState(false);

    useEffect(() => {
        loadUser();
    }, [refetch])

    const loadUser = async () => {
        try {
            const accessToken = await AsyncStorage.getItem("access_token");
            const refreshToken = await AsyncStorage.getItem("refresh_token");
            const response = await axios.get(`${URL_SERVER}/me`, {
                headers: {
                    "access-token": accessToken,
                    "refresh-token": refreshToken
                }
            })
            setUser(response.data.user);
            setLoading(false);
        } catch (error: any) {
            console.log(error);
            setError(error?.message);
            setLoading(false);
        }
    }

    return { loading, user, error, setRefetch, refetch };
}

export default useUser;