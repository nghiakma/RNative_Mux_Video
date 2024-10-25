import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { AnimatedCircularProgress } from "react-native-circular-progress";
import * as Progress from "react-native-progress";
import {
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const CourseProgress = ({progress} : {progress: any}) => {

    return (
        <View style={[styles.courseContainer]}>
            <View style={[styles.progress]}>
                <AnimatedCircularProgress
                    size={40}
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
                            progress.progress < 100 && styles.btnDisabled
                        ]}
                    >
                        <Text style={[styles.btnFinishText]}>Hoàn thành và nhận chứng chỉ</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
    }
})

export default CourseProgress;