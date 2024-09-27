import CartScreen from "@/screens/cart/cart.screen";
import { StripeProvider } from "@stripe/stripe-react-native";

const index = () => {
    return (
        <StripeProvider
            publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
        >
            <CartScreen />
        </StripeProvider>
    )
}

export default index;