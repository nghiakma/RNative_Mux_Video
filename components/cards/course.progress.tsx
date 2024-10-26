import { URL_SERVER } from "@/utils/url";
import { AntDesign, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { AnimatedCircularProgress } from "react-native-circular-progress";
import * as Progress from "react-native-progress";
import {
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const CourseProgress = ({progress} : {progress: any}) => {
    const [modalResultVisible, setModalResultVisible] = useState(false);

    const onFinish = async (id: string) => {
        try {
            if(progress.progress === 1){
                const accessToken = await AsyncStorage.getItem('access_token');
                const refreshToken = await AsyncStorage.getItem('refresh_token');
                axios.post(`${URL_SERVER}/user/get-certificate`, {
                    courseId: id,
                    courseName: progress.name
                }, {
                    headers: {
                        'access-token': accessToken,
                        'refresh-token': refreshToken
                    }
                })
                setModalResultVisible(true);
            }else{
                Alert.alert(
                    'Xin lỗi',
                    'Bạn phải hoàn thành khóa học trước khi nhấn',
                    [
                      {
                        text: 'Đóng',
                        style: 'cancel',
                      },
                    ],
                )
            }
        } catch (error) {
            console.log(error);
        }
    }

    const renderResultModal = () => {
        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalResultVisible}
                    onRequestClose={
                        () => {
                            setModalResultVisible(!modalResultVisible);
                        }
                    }
                >
                    <View style={[styles.centeredView]}>
                        <View style={[styles.modalView]}>
                            <Text style={styles.modalTitle}>Chúc mừng bạn đã hoàn thành khóa học!</Text>
                            <Text style={styles.modalText}>Chứng chỉ của khóa học đã được gửi</Text>
                            <Text style={styles.modalText}>về mail đăng ký. Vui lòng kiểm tra.</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalResultVisible(false)}
                            >
                                <Text style={styles.closeButtonText}>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }



    return (
        <View>
            <View style={[styles.courseContainer]}>
                <View style={[styles.progress]}>
                    <AnimatedCircularProgress
                        size={50}
                        width={4}
                        backgroundWidth={4}
                        fill={progress.progress * 100}
                        tintColor="#0085ff"
                        backgroundColor="rgba(0, 133, 255, 0.3)"
                        rotation={0}
                        duration={500}
                        lineCap="round"
                    >
                        {(fillValue) => (
                            <Text style={{fontSize: 14, fontWeight: '700', color: '#0085ff', fontFamily: "Nunito_500Medium" }}>
                                {Math.round((fillValue / 100) * 100)}%
                            </Text>
                        )}
                    </AnimatedCircularProgress>
                    <View style={[styles.progressRight]}>
                        <Text style={{color: '#b19c19'}}>
                            Bài học
                        </Text>
                        <Progress.Bar
                            progress={progress.progress}
                            width={wp(70)}
                            color="#b19c19"
                        />
                    </View>
                </View>
                <View style={[styles.details]}>
                    <Text style={[styles.detailText]}>{progress.name}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text>{progress.total} Bài học</Text>
                        <TouchableOpacity 
                            style={[
                                styles.btnFinish,
                                progress.progress < 1 && styles.btnDisabled
                            ]}
                            onPress={() => onFinish(progress.courseId)}
                        >
                            <Text style={[styles.btnFinishText]}>Hoàn thành và nhận chứng chỉ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {modalResultVisible && renderResultModal()}
        </View>
    )
}

const styles = StyleSheet.create({
    courseContainer: {
        width: wp(90),
        height: "auto",
        backgroundColor: "#FFFF",
        marginHorizontal: 'auto',
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    progress: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20
    },
    progressRight:{
        gap: 8
    },
    details: {
        marginTop: 10,
        width: '100%',
        gap: 8
    },
    detailText: {
        fontSize: 16,
        fontWeight: '500',
    },
    btnFinish: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#2467EC',
    },
    btnFinishText: {
        color: '#fff',
        fontSize: 14,
    },
    btnDisabled: {
        backgroundColor: '#ccc'
    },

    // Modal
    // centeredView: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     marginTop: 22,
    // },
    // modalView: {
    //     margin: 20,
    //     backgroundColor: 'white',
    //     borderRadius: 20,
    //     padding: 35,
    //     alignItems: 'center',
    //     shadowColor: '#000',
    //     shadowOffset: {
    //         width: 0,
    //         height: 2,
    //     },
    //     shadowOpacity: 0.25,
    //     shadowRadius: 4,
    //     elevation: 5,
    // },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0085ff',
        textAlign: 'center',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginVertical: 5,
    },
    closeButton: {
        width: 100,
        paddingVertical: 10,
        backgroundColor: '#0085ff',
        borderColor: 'white',
        borderWidth: 1,
        marginTop: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
    },
})

export default CourseProgress;