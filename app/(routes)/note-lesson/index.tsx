import { MaterialIcons, FontAwesome5, Entypo } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import axios from "axios";
import { URL_SERVER } from "@/utils/url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "@/components/loader";

const NoteLesson = () => {
    const actions = {
        CREATE: 'CREATE',
        UPDATE: 'UPDATE'
    }
    const [action, setAction] = useState(actions.CREATE);
    const {courseId, courseDataId, name, nameLesson} = useLocalSearchParams();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [notes, setNotes] = useState<{_id: string,subject: string, content: string}[]>([]);
    const [loading, setLoading] = useState(false);
    const [targetUpdateId, setTargetUpdateId] = useState('');

    useEffect(() => {
        const subscription = async () => {
            await fetchNotesOfUserInCurrentCourseDataId();
        }
        subscription();
    }, [])

    const fetchNotesOfUserInCurrentCourseDataId = async () => {
        try {
            setLoading(true);
            const accessToken = await AsyncStorage.getItem('access_token');
            const refreshToken = await AsyncStorage.getItem('refresh_token');
            const response = await axios.get(`${URL_SERVER}/user/get-list-notes?courseId=${courseId}&courseDataId=${courseDataId}`, {
                headers: {
                    'access-token': accessToken,
                    'refresh-token': refreshToken
                }
            })
            if(response.data.response){
                setNotes(response.data.response.note);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    const openBottomSheetCreate = (index: number) => {
        setAction(actions.CREATE);
        bottomSheetRef.current?.snapToIndex(index);
    };

    const openBottomSheetUpdate = (index: number, id: string) => {
        setAction(actions.UPDATE);
        setTargetUpdateId(id);
        const targetNote = notes.find(note => note._id === id);
        if(targetNote){
            setSubject(targetNote.subject);
            setContent(targetNote.content);
            bottomSheetRef.current?.snapToIndex(index);
        }else{
            console.log("Không tìm thấy ghi chú bạn cần!");
        }
    };

    const onSaveNote = async () => {
        try {
            setLoading(true);
            const accessToken = await AsyncStorage.getItem('access_token');
            const refreshToken = await AsyncStorage.getItem('refresh_token');
            await axios.post(`${URL_SERVER}/user/create-note-by-courseDataId`, {
                courseId: courseId,
                courseDataId: courseDataId,
                subject: subject,
                content: content
            }, {
                headers: {
                    'access-token': accessToken,
                    'refresh-token': refreshToken
                }
            });
            const response = await axios.get(`${URL_SERVER}/user/get-list-notes?courseId=${courseId}&courseDataId=${courseDataId}`, {
                headers: {
                    'access-token': accessToken,
                    'refresh-token': refreshToken
                }
            })
            if(response.data.response){
                setNotes(response.data.response.note);
            }
            setSubject('');
            setContent('');
            setLoading(false);
        } catch (error) {
            console.log(error);
        }finally{
            bottomSheetRef.current?.close();
        }
    }

    const onOpenAlertDialog = (id: string) => {
        Alert.alert(
            "Cảnh báo", 
            "Bạn thực sự muốn xóa ghi chú này?", 
            [
                {
                    text: "Hủy bỏ",
                    style: "cancel",
                },
                {
                    text: "Chấp nhận",
                    style: "destructive",
                    onPress: () => onDeleteSingleNote(id)
                }
            ]
        )
    }

    const onDeleteSingleNote = async (id: string) => {
        try {
            setLoading(true);
            const accessToken = await AsyncStorage.getItem('access_token');
            const refreshToken = await AsyncStorage.getItem('refresh_token');
            await axios.delete(`${URL_SERVER}/user/delete-single-note-id-in-note?courseId=${courseId}&courseDataId=${courseDataId}&singleNoteIdInNote=${id}`, {
                headers: {
                    'access-token': accessToken,
                    'refresh-token': refreshToken
                }
            });
            const response = await axios.get(`${URL_SERVER}/user/get-list-notes?courseId=${courseId}&courseDataId=${courseDataId}`, {
                headers: {
                    'access-token': accessToken,
                    'refresh-token': refreshToken
                }
            })
            if(response.data.response){
                setNotes(response.data.response.note);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    const onUpdateSingleNote = async (id: string) => {
        try {
            setLoading(true);
            const accessToken = await AsyncStorage.getItem('access_token');
            const refreshToken = await AsyncStorage.getItem('refresh_token');
            await axios.put(`${URL_SERVER}/user/update-single-note-id-in-note`,{
                courseId: courseId,
                courseDataId: courseDataId,
                subject: subject,
                content: content,
                singleNoteId: id
            } ,{
                headers: {
                    'access-token': accessToken,
                    'refresh-token': refreshToken
                }
            });
            const response = await axios.get(`${URL_SERVER}/user/get-list-notes?courseId=${courseId}&courseDataId=${courseDataId}`, {
                headers: {
                    'access-token': accessToken,
                    'refresh-token': refreshToken
                }
            })
            if(response.data.response){
                setNotes(response.data.response.note);
            }
            setAction(actions.CREATE);
            setTargetUpdateId('');
            setSubject('');
            setContent('');
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            { loading ?
                (
                    <Loader/>
                ):(
                    <GestureHandlerRootView style={styles.container}>
                        <ScrollView style={{flex: 1}}>
                            <View style={{marginVertical: 20}}> 
                                <Text style={[styles.nameText]}>{name}</Text>
                            </View>
                            <TouchableOpacity
                                style={[styles.btnAddNew]}
                                onPress={() => openBottomSheetCreate(0)}
                            >
                                <Text style={[styles.btnAddNewText]}>Tạo mới ghi chú</Text>
                            </TouchableOpacity>
                            <View style={{width: wp(90), marginTop: 20, marginBottom: 10, marginHorizontal: 'auto'}}>
                                <Text style={[styles.nameText2]}>{nameLesson}</Text>
                            </View>
                            <View style={{gap: 10}}>
                                { notes.length > 0 ? 
                                    notes.map((note) => (
                                        <View key={note._id}>
                                            {/* Single note */}
                                            <View style={[styles.noteContainer]}>
                                                <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 15}}>{note.subject}</Text>
                                                <Text style={{fontSize: 14, color: '#444', marginBottom: 10}}>{note.content}</Text>
                                                <View style={[styles.noteBtnContainer]}>
                                                    <TouchableOpacity
                                                        style={[styles.noteBtn, styles.noteBtnUpdate]}
                                                        onPress={() => openBottomSheetUpdate(0, note._id)}
                                                    >
                                                        <MaterialIcons name="note-add" size={20} color="white" />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={[styles.noteBtn, styles.noteBtnDelete]}
                                                        onPress={() => onOpenAlertDialog(note._id)}
                                                    >
                                                        <FontAwesome5 name="trash-alt" size={20} color="black" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            {/* Single note */}
                                        </View>
                                    ))
                                    :
                                    (
                                        <View style={{marginTop: 10, alignItems: 'center'}}>
                                            <Entypo name="cloud" size={60} color="#ccc" />
                                            <Text 
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: '500',
                                                    color: '#666',
                                                    marginTop: 10,
                                                    textAlign: 'center',
                                                }}
                                            >
                                                Xin lỗi, hiện tại không có dữ liệu
                                            </Text>
                                        </View>
                                    )
                                }
                            </View>
                        </ScrollView>  
                        <BottomSheet
                            ref={bottomSheetRef}
                            index={-1}
                            snapPoints={['80%']}
                            enableDynamicSizing={false}
                            enablePanDownToClose={true}
                        >
                            <BottomSheetView style={styles.contentContainer}>
                                {/* Tạo mới */}
                                { action === actions.CREATE && (
                                    <View style={{width: wp(100)}}>
                                        <Text style={[styles.bottomSheetTitleText]}>
                                            Ghi chú mới
                                        </Text>
                                        <View>
                                            <TextInput 
                                                value={subject}
                                                onChangeText={(v) => setSubject(v)}
                                                placeholder="Chủ đề"
                                                style={[styles.bottemSheetInput]}
                                                placeholderTextColor="#aaa"
                                            />
                                            <TextInput 
                                                value={content}
                                                onChangeText={(v) => setContent(v)}
                                                placeholder="Nội dung"
                                                style={[styles.bottemSheetInput]}
                                                placeholderTextColor="#aaa"
                                            />
                                            <TouchableOpacity onPress={() => onSaveNote()} style={[styles.bottomSheetSaveBtn, {marginHorizontal: 10}]}>
                                                <Text style={{color: 'white', fontSize: 16}}>Lưu</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                                {/* Cập nhật */}
                                { action === actions.UPDATE && (
                                    <View style={{width: wp(100)}}>
                                        <Text style={[styles.bottomSheetTitleText]}>
                                            Nội dung ghi chú
                                        </Text>
                                        <View>
                                            <TextInput 
                                                value={subject}
                                                onChangeText={(v) => setSubject(v)}
                                                placeholder="Chủ đề"
                                                style={[styles.bottemSheetInput]}
                                                placeholderTextColor="#aaa"
                                            />
                                            <TextInput 
                                                value={content}
                                                onChangeText={(v) => setContent(v)}
                                                placeholder="Nội dung"
                                                style={[styles.bottemSheetInput]}
                                                placeholderTextColor="#aaa"
                                            />
                                            <TouchableOpacity onPress={() => onUpdateSingleNote(targetUpdateId)} style={[styles.bottomSheetSaveBtn, {marginHorizontal: 10}]}>
                                                <Text style={{color: 'white', fontSize: 16}}>Lưu</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </BottomSheetView>
                        </BottomSheet>
                    </GestureHandlerRootView>
                )
            }
        </>
    )
}

const styles = StyleSheet.create({
    nameText: {
        color: '#0085ff', 
        fontSize: 18, 
        fontWeight: 'bold', 
        textAlign: 'center'
    },
    nameText2: {
        fontWeight: 'bold', 
        color: '#237867', 
        fontSize: 18, 
        textAlign: 'center'
    },
    btnAddNew: {
        width: wp(90),
        marginBottom: 10,
        marginHorizontal: 'auto',
        borderWidth: 1,
        backgroundColor: '#0085ff',
        borderColor: 'white',
        borderRadius: 8,
        paddingVertical: 8,
    },
    btnAddNewText: {
        fontSize: 16, 
        color: 'white', 
        textAlign: 'center'
    },
    // Single Note
    noteContainer: {
        width: wp(90),
        marginBottom: 10,
        marginHorizontal: 'auto',
        backgroundColor: '#ccc',
        height: 120,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 8
    },
    noteBtnContainer: {
        flexDirection: 'row', 
        gap: 10, 
        alignItems: 'center', 
        marginTop: 'auto'
    },
    noteBtn: {
        width: 30,
        height: 30,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noteBtnUpdate: {
        backgroundColor: '#0085ff',
    },
    noteBtnDelete: {
        backgroundColor: '#f4f4f4',
    },

    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'flex-start',
        padding: 0,
    },

    bottomSheetTitleText: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 18,
        fontWeight: '500'
    },
    bottemSheetInput: {
        marginHorizontal: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 6,
        marginBottom: 10
    },
    bottomSheetSaveBtn: {
        width: wp(20),
        backgroundColor: '#0085ff',
        height: 40,
        borderRadius: 8,
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default NoteLesson;