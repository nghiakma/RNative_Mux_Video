import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Toast } from "react-native-toast-notifications";

const CourseQuizzScreen = () => {
    const { courseData, activeVideo } = useLocalSearchParams();
    const data: CoursesType = JSON.parse(courseData as string);
    const contentVideoQuizz: IQuizz[] = data.courseData[activeVideo as any].iquizz;
    const [currQuestIndex, setCurrQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);

    const OnHandleNextQuestion = () => {
        if(contentVideoQuizz.length  === currQuestIndex){
            return;
        }
        setCurrQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
    }

    const OnHandlePressOption = (option: any) => {
        setSelectedOption(option);
        const isAnswerCorrect: any = contentVideoQuizz[currQuestIndex].correctAnswer === option;
        setIsCorrect(isAnswerCorrect);

        if(isAnswerCorrect){
            setScore(prev => prev + 1);
            alert('Chính xác');
        }

    }

    const OnHandleFinish = () => {
        alert("Chúc mừng bạn đã hoàn thành bài kiểm tra")
    }
    return (
        <>
            <ScrollView >
                <View style={[styles.options]}>
                    <Text>Điểm: {score}/{contentVideoQuizz.length}</Text>
                    <Text style={{marginVertical: 10, fontSize: 18}}>
                        Câu {currQuestIndex + 1}: {contentVideoQuizz[currQuestIndex].question}
                    </Text>
                    {
                        contentVideoQuizz[currQuestIndex].options.map((option, index) => (
                            <TouchableOpacity
                                onPress={() => OnHandlePressOption(option)}
                                key={`${index}-a`}
                                style={[styles.option]}
                                disabled={isCorrect ? true : false}
                            >
                                <Text>{option}</Text>
                            </TouchableOpacity>
                        ))
                    }
                    { currQuestIndex === contentVideoQuizz.length - 1
                        ? (
                            <TouchableOpacity
                                style={[styles.btnNext]}
                                onPress={() => OnHandleFinish()}
                            >
                                <Text style={{color: 'white'}}>Hoàn thành</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={[styles.btnNext]}
                                onPress={() => OnHandleNextQuestion()}
                            >
                                <Text style={{color: 'white'}}>Tiếp theo</Text>
                            </TouchableOpacity>
                        )
                    }
                </View>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    options: {
        paddingHorizontal: 10,
        marginTop: 10,
        gap: 4,
    },
    option: {
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    btnNext: {
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor: '#0085ff',
        marginTop: 10,
        display: 'flex',
        alignItems: 'center'
    }
})

export default CourseQuizzScreen;