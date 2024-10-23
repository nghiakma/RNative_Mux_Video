import { URL_SERVER } from "@/utils/url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStripe } from "@stripe/stripe-react-native";
import axios from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from "react-native"
import AccountConfirmation from "@/assets/images/account_confirmation.png";
import EmptyCart from "@/assets/images/empty_cart.png";
import { Toast } from "react-native-toast-notifications";
import { useDispatch } from "react-redux";
import * as userActions from "../../utils/store/actions"; 

const CartScreen = () => {
    const [cartItems, setCartItems] = useState<CoursesType[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const dispatch = useDispatch();

    const FetchCartUser = async () => {
        try {
            const cart: any = await AsyncStorage.getItem("cart");
            setCartItems(JSON.parse(cart));
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        FetchCartUser();
    }, [])

    const OnRefresh = async () => {
        setRefreshing(true);
        const cart: any = await AsyncStorage.getItem("cart");
        setCartItems(cart);
        setRefreshing(false);
    }

    const CalculateTotalPrice = () => {
        const totalPrice = cartItems.reduce(
            (total, item) => total + item.price,
            0
        );
        return totalPrice.toFixed(2);
    }

    const OnHandleCourseDetails = (courseDetails: any) => {
        router.push({
            pathname: "/(routes)/course-details",
            params: { item: JSON.stringify(courseDetails) }
        })
    }

    const OnHandleRemoveItem = async (item: any) => {
        try {
            const accessToken = await AsyncStorage.getItem("access_token");
            const refreshToken = await AsyncStorage.getItem("refresh_token");
            const existingCartData = await AsyncStorage.getItem("cart");
            const cartData = existingCartData ? JSON.parse(existingCartData) : [];
            const updatedCartData = cartData.filter((i: any) => i._id !== item._id);
            await AsyncStorage.setItem("cart", JSON.stringify(updatedCartData));
            setCartItems(updatedCartData);
            const response = await axios.put(`${URL_SERVER}/delete-course`, item, {
                headers: {
                    'access-token': accessToken,
                    'refresh-token': refreshToken
                }
            })
            Toast.show(response.data.message, {
                type: 'success'
            })
        } catch (error: any) {
            console.log(error.message);
        }
    }

    const OnHandlePayment = async () => {
        try {
            const accessToken = await AsyncStorage.getItem("access_token");
            const refreshToken = await AsyncStorage.getItem("refresh_token");
            const amount = Math.round(
                cartItems.reduce((total, item) => total + item.price, 0) / 1000
            );
            const paymentIntentResponse = await axios.post(
                `${URL_SERVER}/payment`,
                { amount },
                {
                    headers: {
                        "access-token": accessToken,
                        "refresh-token": refreshToken
                    }
                }
            );
            const { client_secret: clientSecret } = paymentIntentResponse.data;
            const initSheetResponse = await initPaymentSheet({
                merchantDisplayName: "Becodemy Private Ltd.",
                paymentIntentClientSecret: clientSecret
            });
            if (initSheetResponse.error) {
                console.error(initSheetResponse.error);
                return;
            }
            const paymentResponse = await presentPaymentSheet();
            if (paymentResponse.error) {
                console.error(paymentResponse.error);
            } else {
                await CreateOrder(paymentResponse);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const CreateOrder = async (paymentResponse: any) => {
        try {
            const accessToken = await AsyncStorage.getItem("access_token");
            const refreshToken = await AsyncStorage.getItem("refresh_token");
            let currCart: CoursesType[] = cartItems;
            let paymentOrders: { _id: string }[] = [];
            currCart.forEach(async (course) => {
                paymentOrders.push({ _id: course._id });
                await axios.post(`${URL_SERVER}/create-mobile-order`, {
                    courseId: course._id,
                    payment_info: paymentResponse
                }, {
                    headers: {
                        "access-token": accessToken,
                        "refresh-token": refreshToken
                    }
                });
                await axios.put(`${URL_SERVER}/delete-course`, course, {
                    headers: {
                        'access-token': accessToken,
                        'refresh-token': refreshToken
                    }
                })

                let payload = {
                    courseId: course._id,
                    progress: 0
                }
                dispatch(userActions.pushProgressOfUser(payload));
            })
            setOrderSuccess(true);
            currCart = [];
            await AsyncStorage.setItem("paymented", JSON.stringify(paymentOrders));
            await AsyncStorage.setItem("cart", JSON.stringify(currCart));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#FFF" }}>
            {orderSuccess ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Image
                        source={AccountConfirmation}
                        style={{
                            width: 200,
                            height: 200,
                            resizeMode: "contain",
                            marginBottom: 20
                        }}
                    />
                    <View style={{ alignItems: "center", marginBottom: 20 }}>
                        <Text style={{ fontSize: 22, fontFamily: "Raleway_700Bold" }}>
                            Thanh toán thành công
                        </Text>
                        <Text>
                            Cảm ơn bạn đã tin tưởng và lựa chọn sản phẩm của chúng tôi!
                        </Text>
                    </View>
                    <View style={{ alignItems: "center", marginBottom: 20 }}>
                        <Text>
                            Bạn sẽ sớm nhận được một email của chúng tôi!
                        </Text>
                    </View>
                </View>
            ) : (
                <>
                    <FlatList
                        data={cartItems}
                        keyExtractor={(item) => item._id + ""}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={{
                                    flexDirection: "row",
                                    marginVertical: 8,
                                    borderRadius: 8,
                                    padding: 10,
                                    backgroundColor: "#FFF"
                                }}
                            >
                                <TouchableOpacity onPress={() => OnHandleCourseDetails(item)}>
                                    <Image
                                        source={{ uri: item.thumbnail.url! }}
                                        style={{
                                            width: 100,
                                            height: 100,
                                            marginRight: 16,
                                            borderRadius: 8
                                        }}
                                    />
                                </TouchableOpacity>
                                <View style={{ flex: 1, justifyContent: "space-between" }}>
                                    <TouchableOpacity onPress={() => OnHandleCourseDetails(item)}>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: "600",
                                                fontFamily: "Nunito_700Bold"
                                            }}
                                        >
                                            {item?.name}
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
                                            <View style={{ flexDirection: "row", alignItems: "center", marginRight: 16 }}>
                                                <Text style={{ fontSize: 16, color: "#808080", fontFamily: "Nunito_400Regular" }}>
                                                    {item.level}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: "row", alignItems: "center", marginRight: 16 }}>
                                                <Text style={{ marginLeft: 0, fontSize: 16, color: "#808080" }}>
                                                    {item.price}đ
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: "#FF6347",
                                            borderRadius: 5,
                                            padding: 5,
                                            marginTop: 10,
                                            width: 100,
                                            alignSelf: "flex-start"
                                        }}
                                        onPress={() => OnHandleRemoveItem(item)}
                                    >
                                        <Text
                                            style={{
                                                color: "#FFF",
                                                fontSize: 16,
                                                textAlign: "center",
                                                fontFamily: "Nunito_600SemiBold"
                                            }}
                                        >
                                            Xóa
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={() => (
                            <View
                                style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }}
                            >
                                <Image
                                    source={EmptyCart}
                                    style={{ width: 200, height: 200, resizeMode: "contain" }}
                                />
                                <Text
                                    style={{
                                        fontSize: 24,
                                        marginTop: 20,
                                        color: "#333",
                                        fontFamily: "Raleway_600SemiBold"
                                    }}
                                >
                                    Giỏ hàng của bạn đang trống!
                                </Text>
                            </View>
                        )}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={() => OnRefresh()} />
                        }
                    />
                    <View style={{ marginBottom: 25 }}>
                        {cartItems?.length === 0 ||
                            (cartItems?.length > 0 && (
                                <Text
                                    style={{
                                        fontSize: 18,
                                        textAlign: "center",
                                        marginTop: 20,
                                        fontFamily: "Nunito_700Bold"
                                    }}
                                >
                                    Thành tiền: {CalculateTotalPrice()}đ
                                </Text>
                            ))}
                        {cartItems?.length === 0 ||
                            (cartItems?.length > 0 && (
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: "#007BFF",
                                        borderRadius: 5,
                                        padding: 10,
                                        marginTop: 20,
                                        width: "80%",
                                        alignSelf: "center"
                                    }}
                                    onPress={() => OnHandlePayment()}
                                >
                                    <Text
                                        style={{
                                            color: "#FFF",
                                            fontSize: 18,
                                            textAlign: "center",
                                            fontFamily: "Nunito_600SemiBold"
                                        }}
                                    >
                                        Tiến hành thanh toán
                                    </Text>
                                </TouchableOpacity>
                            ))}
                    </View>
                </>
            )}
        </View>
    )
}

export default CartScreen;