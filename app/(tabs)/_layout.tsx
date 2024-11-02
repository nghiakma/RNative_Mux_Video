import useUser from "@/hooks/useUser";
import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ToastProvider } from "react-native-toast-notifications";
import TabBar from "@/components/tabs/TabBar";
const TabsLayout = () => {
    const { user } = useUser();

    return (
        <ToastProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <Tabs
                    tabBar={props => <TabBar {...props}/>}
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    <Tabs.Screen 
                        name="index" 
                        options={{
                            title: 'Trang chủ'
                        }}
                    />
                    <Tabs.Screen 
                        name="search/index" 
                        options={{
                            title: 'Tìm kiếm'
                        }}    
                    />
                    <Tabs.Screen 
                        name="courses/index" 
                        options={{
                            title: 'Khóa học'
                        }}    
                    />
                    <Tabs.Screen 
                        name="wishlist/index"
                        options={{
                            title: 'Yêu thích'
                        }}    
                    />
                    <Tabs.Screen 
                        name="profile/index" 
                        options={{
                            title: 'Hồ sơ'
                        }}    
                    />
                </Tabs>
            </SafeAreaView>
        </ToastProvider>
    )
}

export default TabsLayout;