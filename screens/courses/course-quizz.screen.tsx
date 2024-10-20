import Loader from "@/components/loader";
import { URL_SERVER } from "@/utils/url";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { 
    ScrollView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View, 
    Alert, 
    Modal, 
    Pressable, 
    Image
} from "react-native";
import useUser from "@/hooks/useUser";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import SuccessImage from "../../assets/images/success_2.png";
import SmileFace from "../../assets/images/smile_face.png";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Nunito_400Regular, Nunito_500Medium, Nunito_700Bold, Nunito_600SemiBold } from "@expo-google-fonts/nunito";
import { Raleway_600SemiBold, Raleway_700Bold } from "@expo-google-fonts/raleway";
import { useFonts } from "expo-font";
import { AntDesign, Entypo, Octicons } from "@expo/vector-icons";

const CourseQuizzScreen = () => {
    const { courseData, activeVideo, id } = useLocalSearchParams();
    const {user} = useUser();
    const data: CoursesType = JSON.parse(courseData as string);    
    const [questions, setQuestions] = useState<IQuizz[]>([]);
    const [seletedOptions, setSelectedOptions] = useState<{[key: number]: any}>({});
    const [scored, setScored] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(true);
    const [lesson, setLesson] = useState<any>(data.courseData[activeVideo as any]);
    const [modalResultVisible, setModalVisible] = useState(false);
    const MAX_POINTS_SCREEN = 100;
    const [fillScreen, setFillScreen] = useState(0);

    useEffect(() => {
        setLoading(true);
        getQuestions();
        const description = async () => {
            try {
                const accessToken = await AsyncStorage.getItem("access_token");
                const refreshToken = await AsyncStorage.getItem("refresh_token");
                const response = await axios.get(`${URL_SERVER}/quizzs/${user?._id}?lessonId=${lesson._id}`,{
                    headers: {
                        "access-token": accessToken,
                        "refresh-token": refreshToken
                    }
                });
                const userId = response.data.userId;
                const data = response.data.response.filter((item: OwnerQuizz) => item.userId === userId);
                const _data = data.filter((item: OwnerQuizz) => item.lessonId === lesson._id);
                if(_data.length > 0){
                    const result = _data[_data.length - 1];
                    setSelectedOptions(result.selected_options);
                    setScored(result.scored);
                    setShowResults(true);
                    setModalVisible(true);
                }

            } catch (error) {
                console.log(error);
            }finally{
                setLoading(false);
            }
        }
        description();
    },[])

    useEffect(() => {
        if(questions.length > 0){
            setFillScreen((scored / questions.length) * MAX_POINTS_SCREEN);
        }
    }, [scored])

    const getQuestions = () => {
        axios
            .get(`${URL_SERVER}/get-courses`)
            .then((response) => {
                const course = response.data.courses.filter(
                    (course: CoursesType) => course._id === id
                )[0];
                setLesson(course.courseData[activeVideo as any]);
                setQuestions(course.courseData[activeVideo as any].iquizz as IQuizz[]);
            })
            .catch((error) => {
                console.log('>>> Line: 68');
                console.log(error);
            })
    }

    const OnHandleOptionSelect = (questionIndex: any, option: any) => {
        const updatedOptions = {
            ...seletedOptions,
            [questionIndex]: option
        };
        setSelectedOptions(updatedOptions);
    }

    const OnHandleSubmit = async () => {
        let correctAnswers = 0;
        questions.forEach((question: IQuizz, index: any) => {
            if (question.options[seletedOptions[index]] === question.correctAnswer) {
                correctAnswers++;
            }
        });
        setScored(correctAnswers);
        setFillScreen((correctAnswers / questions.length) * MAX_POINTS_SCREEN);
        setShowResults(true);

        try {
            let data = {
                userId: user?._id,
                courseId: id,
                lessonId: lesson._id,
                scored: correctAnswers,
                selected_options: seletedOptions
            }
            await axios.post(`${URL_SERVER}/save-quizz`, data);
        } catch (error) {
            console.log(error);
        }
        
    }

    const onRetry = () => {
        setSelectedOptions({});
        setScored(0);
        setFillScreen((0 / questions.length) * MAX_POINTS_SCREEN);
        setShowResults(false);
        setModalVisible(false);
    }

    let [fontsLoaded, fontsError] = useFonts({
        Raleway_600SemiBold,
        Raleway_700Bold,
        Nunito_400Regular,
        Nunito_500Medium,
        Nunito_700Bold,
        Nunito_600SemiBold,
    });

    if (!fontsLoaded && !fontsError) {
        return null;
    }

    const closeModal = () => {
        setModalVisible(false);
        // console.log(fillScreen);
        // console.log((scored / questions.length) * MAX_POINTS_SCREEN);
        // setFillScreen((scored / questions.length) * MAX_POINTS_SCREEN);
    }

    const renderResultModal = () => {
        const MAX_POINTS = 100;
        const fill = (scored / questions.length) * MAX_POINTS;
        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalResultVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalVisible(!modalResultVisible);
                    }
                }>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <AnimatedCircularProgress
                                    size={120}
                                    width={12}
                                    backgroundWidth={12}
                                    fill={fill}
                                    tintColor="#0085ff"
                                    backgroundColor="rgba(0, 133, 255, 0.3)"
                                    rotation={0}
                                    duration={2000}
                                    lineCap="round"
                                >
                                    {(fillValue) => (
                                        <View>
                                            <Text style={{fontSize: 20, fontWeight: '700', color: '#0085ff', fontFamily: "Nunito_500Medium" }}>
                                                {Math.round((fillValue / 100) * MAX_POINTS)}
                                            </Text>
                                        </View>
                                    )}
                                </AnimatedCircularProgress>
                                <View 
                                    style={{
                                        borderColor: '#0085ff',
                                        borderWidth: 1,
                                        borderRadius: 6,
                                        marginVertical: 10,
                                        paddingVertical: 10,
                                        paddingHorizontal: 15,
                                        width: 320,
                                        gap: 20
                                    }}
                                >
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <View>
                                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                                                <View style={{width: 14, height: 14, backgroundColor: '#0085ff', borderRadius: 100, marginTop: 3}}></View>
                                                <Text style={{fontSize: 20, color: '#0085ff'}}>100%</Text>
                                            </View>
                                            <Text style={[{fontFamily: 'Nunito_700Bold'}]}>
                                                Hoàn thành
                                            </Text>
                                        </View>
                                        <View style={{width: 86}}>
                                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                                                <View style={{width: 14, height: 14, backgroundColor: '#0085ff', borderRadius: 100, marginTop: 2}}></View>
                                                <Text style={{fontSize: 20, color: '#0085ff'}}>{questions.length}</Text>
                                            </View>
                                            <Text style={[{fontFamily: 'Nunito_700Bold'}]}>
                                                Tổng câu hỏi
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <View>
                                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                                                <View style={{width: 14, height: 14, backgroundColor: '#3db655', borderRadius: 100, marginTop: 2}}></View>
                                                <Text style={{fontSize: 20, color: '#3db655'}}>{scored}</Text>
                                            </View>
                                            <Text style={[{fontFamily: 'Nunito_700Bold'}]}>
                                                Câu đúng
                                            </Text>
                                        </View>
                                        <View style={{width: 86}}>
                                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                                                <View style={{width: 14, height: 14, backgroundColor: 'red', borderRadius: 100, marginTop: 2}}></View>
                                                <Text style={{fontSize: 20, color: 'red'}}>{questions.length - scored}</Text>
                                            </View>
                                            <Text style={[{fontFamily: 'Nunito_700Bold'}]}>
                                                Câu sai
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                {/* Nút nhấn Modal */}
                                <View style={{flexDirection: 'row', alignItems: 'center', gap: 40}}>
                                    <View
                                        style={{justifyContent: 'center', alignItems: 'center'}}
                                    >
                                        <Pressable
                                            style={[
                                                styles.button, 
                                                styles.buttonClose, 
                                                {
                                                    alignItems: 'center', 
                                                    justifyContent: 'center',
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 40
                                                }
                                            ]}
                                            onPress={() => onRetry()}
                                        >
                                            <AntDesign name="sync" size={18} color="#fff" />
                                        </Pressable>
                                        <Text style={[styles.textStyle, {color: '#444'}]}>Thử lại</Text>
                                    </View>
                                    <View
                                        style={{justifyContent: 'center', alignItems: 'center'}}
                                    >
                                        <Pressable
                                            style={[
                                                styles.button, 
                                                styles.buttonClose, 
                                                {
                                                    alignItems: 'center', 
                                                    justifyContent: 'center',
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 40
                                                }
                                            ]}
                                            onPress={() => closeModal()}
                                        >
                                            <Octicons name="eye" size={18} color="#fff" />
                                        </Pressable>
                                        <Text style={[styles.textStyle, {color: '#444'}]}>Review</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                </Modal>
            </View>
        )
    }

    const renderTextFinishScreen = () => {
        const questionLength = questions.length;
        let selectedLength = 0;
        Object.keys(seletedOptions).forEach(key => {
            selectedLength++;
        })
        const finishQuantity = (selectedLength / questionLength) * 100;
        return (
            <>
                { showResults ?
                    (
                        <Text style={{fontSize: 20, color: '#0085ff'}}>{finishQuantity}%</Text>
                    ) : (
                        <Text style={{fontSize: 20, color: '#0085ff'}}>0%</Text>
                    )
                }
            </>
        )
    }

    const renderTextCorrectScreen = () => {
        const quizzs = questions;
        let correctLength = 0;
        quizzs.forEach((quizz, index) => {
            if(quizz.options[seletedOptions[index]] === quizz.correctAnswer){
                correctLength++;
            }
        });
        return (
            <>
                { showResults ? 
                    (
                        <Text style={{fontSize: 20, color: '#3db655'}}>{correctLength}</Text>
                    ):(
                        <Text style={{fontSize: 20, color: '#3db655'}}>0</Text>
                    )
                }
            </>
        )
    }

    const renderTextWrongScreen = () => {
        const quizzs = questions;
        let correctLength = 0;
        quizzs.forEach((quizz, index) => {
            if(quizz.options[seletedOptions[index]] === quizz.correctAnswer){
                correctLength++;
            }
        });
        return (
            <>
                { showResults ? 
                    (
                        <Text style={{fontSize: 20, color: 'red'}}>{questions.length - correctLength}</Text>
                    ):(
                        <Text style={{fontSize: 20, color: 'red'}}>0</Text>
                    )
                }
            </>
        )
    }

    return (
        <>
            { loading ? (
                <Loader />
            ) : (
                <ScrollView style={{ backgroundColor: '#aaa', flex: 1 }}>
                    { questions.length > 0 &&
                        questions.map((item: IQuizz, index: number) => (
                            <View style={styles.options} key={item._id}>
                                <Text style={styles.question}>
                                    Câu {index + 1}: {item.question} 
                                </Text>    
                                <TouchableOpacity
                                    style={[
                                        styles.option,
                                        seletedOptions[index] === 0 && styles.selectedOption,
                                        showResults && item.correctAnswer === item.options[0] && styles.correctOption,
                                        showResults && seletedOptions[index] === 0 && item.options[seletedOptions[index]] !== item.correctAnswer && styles.wrongOption
                                    ]}
                                    onPress={() => OnHandleOptionSelect(index, 0)}
                                    disabled={showResults}
                                >
                                    <Text>{item.options[0]}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.option,
                                        seletedOptions[index] === 1 && styles.selectedOption,
                                        showResults && item.correctAnswer === item.options[1] && styles.correctOption,
                                        showResults && seletedOptions[index] === 1 && item.options[seletedOptions[index]] !== item.correctAnswer && styles.wrongOption
                                    ]}
                                    onPress={() => OnHandleOptionSelect(index, 1)}
                                    disabled={showResults}
                                >
                                    <Text>{item.options[1]}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.option,
                                        seletedOptions[index] === 2 && styles.selectedOption,
                                        showResults && item.correctAnswer === item.options[2] && styles.correctOption,
                                        showResults && seletedOptions[index] === 2 && item.options[seletedOptions[index]] !== item.correctAnswer && styles.wrongOption
                                    ]}
                                    onPress={() => OnHandleOptionSelect(index, 2)}
                                    disabled={showResults}
                                >
                                    <Text>{item.options[2]}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.option,
                                        seletedOptions[index] === 3 && styles.selectedOption,
                                        showResults && item.correctAnswer === item.options[3] && styles.correctOption,
                                        showResults && seletedOptions[index] === 3 && item.options[seletedOptions[index]] !== item.correctAnswer && styles.wrongOption
                                    ]}
                                    onPress={() => OnHandleOptionSelect(index, 3)}
                                    disabled={showResults}
                                >
                                    <Text>{item.options[3]}</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    }
                    <View style={[styles.options, {alignItems: 'center'}]}>
                        <AnimatedCircularProgress
                            size={120}
                            width={12}
                            backgroundWidth={12}
                            fill={fillScreen}
                            tintColor="#0085ff"
                            backgroundColor="rgba(0, 133, 255, 0.3)"
                            rotation={0}
                            duration={2000}
                            lineCap="round"
                        >
                            {(fillValue) => (
                                <View>
                                    <Text style={{fontSize: 20, fontWeight: '700', color: '#0085ff', fontFamily: "Nunito_500Medium" }}>
                                        {Math.round((fillValue / 100) * MAX_POINTS_SCREEN)}
                                        {/* {fillValue} */}
                                    </Text>
                                </View>
                            )}
                        </AnimatedCircularProgress>
                        <View 
                            style={{
                                borderColor: '#0085ff',
                                borderWidth: 1,
                                borderRadius: 6,
                                marginVertical: 10,
                                paddingVertical: 10,
                                paddingHorizontal: 15,
                                width: 320,
                                gap: 20
                            }}
                        >
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <View>
                                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                                        <View style={{width: 14, height: 14, backgroundColor: '#0085ff', borderRadius: 100, marginTop: 3}}></View>
                                        { renderTextFinishScreen() }
                                    </View>
                                    <Text style={[{fontFamily: 'Nunito_700Bold'}]}>
                                        Hoàn thành
                                    </Text>
                                </View>
                                <View style={{width: 86}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                                        <View style={{width: 14, height: 14, backgroundColor: '#0085ff', borderRadius: 100, marginTop: 2}}></View>
                                        <Text style={{fontSize: 20, color: '#0085ff'}}>{questions.length}</Text>
                                    </View>
                                    <Text style={[{fontFamily: 'Nunito_700Bold'}]}>
                                        Tổng câu hỏi
                                    </Text>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <View>
                                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                                        <View style={{width: 14, height: 14, backgroundColor: '#3db655', borderRadius: 100, marginTop: 2}}></View>
                                        {/* <Text style={{fontSize: 20, color: '#3db655'}}>{scored}</Text> */}
                                        { renderTextCorrectScreen() }
                                    </View>
                                    <Text style={[{fontFamily: 'Nunito_700Bold'}]}>
                                        Câu đúng
                                    </Text>
                                </View>
                                <View style={{width: 86}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                                        <View style={{width: 14, height: 14, backgroundColor: 'red', borderRadius: 100, marginTop: 2}}></View>
                                        {/* <Text style={{fontSize: 20, color: 'red'}}>{questions.length - scored}</Text> */}
                                        { renderTextWrongScreen() }
                                    </View>
                                    <Text style={[{fontFamily: 'Nunito_700Bold'}]}>
                                        Câu sai
                                    </Text>
                                </View>
                            </View>
                        </View>
                        {/* Nút nhấn Modal */}
                        <View style={[{flexDirection: 'row', alignItems: 'center'}]}>
                            <View
                                style={{justifyContent: 'center', alignItems: 'center'}}
                            >
                                <Pressable
                                    style={[
                                        styles.button, 
                                        styles.buttonClose, 
                                        {
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            width: 40,
                                            height: 40,
                                            borderRadius: 40
                                        },
                                        !showResults && {display: 'none'}
                                    ]}
                                    onPress={() => onRetry()}
                                >
                                    <AntDesign name="sync" size={18} color="#fff" />
                                </Pressable>
                                <Text style={[styles.textStyle, {color: '#444'}, !showResults && {display: 'none'}]}>Thử lại</Text>
                            </View>
                            <View
                                style={{justifyContent: 'center', alignItems: 'center'}}
                            >
                                <Pressable
                                    style={[
                                        styles.button, 
                                        styles.buttonClose, 
                                        {
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            width: 40,
                                            height: 40,
                                            borderRadius: 40
                                        },
                                        showResults && styles.btnDisabled
                                    ]}
                                    onPress={() => OnHandleSubmit()}
                                >
                                    <Entypo name="download" size={18} color="#fff" />
                                </Pressable>
                                <Text style={[styles.textStyle, {color: '#444'}, showResults && {display: 'none'}]}>Nộp bài</Text>
                            </View>
                        </View>
                    </View>
                    { modalResultVisible &&
                        renderResultModal()
                    }
                </ScrollView>
            )}
        </>
    );
}


const styles = StyleSheet.create({
    options: {
        padding: 10,
        margin: 10,
        gap: 4,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    option: {
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: "#eee",
        marginVertical: 5
    },
    selectedOption: {
        backgroundColor: '#aaa',
        color: 'white'
    },
    btnNext: {
        backgroundColor: '#0085ff',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    btnDisabled: {
        backgroundColor: '#ccc',
        display: 'none'
    },
    btnText: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center'
    },
    question: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10
    },
    result: {
        alignContent: 'center',
        justifyContent: 'center',
    },
    resultText: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 10
    },
    btnTryAgain: {
        backgroundColor: '#0085ff',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        marginHorizontal: 10
    },
    btnTryAgainText: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center'
    },
    selectedOptions: {
        backgroundColor: '#949494'
    },
    correctOption: {
        backgroundColor: 'green'
    },
    wrongOption: {
        backgroundColor: 'red'
    },


    // Modal
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
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        color: '#3db655',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '700'
    },
})

export default CourseQuizzScreen;