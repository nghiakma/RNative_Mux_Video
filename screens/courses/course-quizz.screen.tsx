import Loader from "@/components/loader";
import { URL_SERVER } from "@/utils/url";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useUser from "@/hooks/useUser";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

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
                const result = _data[_data.length - 1];
                setSelectedOptions(result.selected_options);
                setScored(result.scored);
                setShowResults(true);
            } catch (error) {
                console.log(error);
            }finally{
                setLoading(false);
            }
        }
        description();
    },[])

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
        setShowResults(false);
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
                    { showResults && (
                        <View style={styles.result}>
                            <Text style={styles.resultText}>
                                Điểm: {scored} trên {questions.length}
                            </Text>
                            <TouchableOpacity style={styles.btnTryAgain} onPress={onRetry}>
                                <Text style={styles.btnTryAgainText}>Thử lại</Text>   
                            </TouchableOpacity>
                        </View>
                    )}
                    <TouchableOpacity
                        style={[styles.btnNext, showResults && styles.btnDisabled]}
                        onPress={OnHandleSubmit}
                        disabled={showResults}
                    >
                        <Text style={styles.btnText}>Nộp bài</Text>
                    </TouchableOpacity>
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
    }
})

export default CourseQuizzScreen;