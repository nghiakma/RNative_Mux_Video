import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const NoteLesson = () => {
    const {id, name} = useLocalSearchParams();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');

    const handleSnapPress = useCallback((index: number) => {
        bottomSheetRef.current?.snapToIndex(index);
    }, []);

    const onSaveNote = () => {
        bottomSheetRef.current?.close();
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <ScrollView style={{flex: 1}}>
                <View style={{marginVertical: 20}}> 
                    <Text style={[styles.nameText]}>{name}</Text>
                </View>
                <TouchableOpacity
                    style={[styles.btnAddNew]}
                    onPress={() => handleSnapPress(0)}
                >
                    <Text style={[styles.btnAddNewText]}>Tạo mới ghi chú</Text>
                </TouchableOpacity>
                <View>
                    <View style={{width: wp(90), marginTop: 20, marginBottom: 10, marginHorizontal: 'auto'}}>
                        <Text style={[styles.nameText2]}>Ghi chú của tôi</Text>
                    </View>
                    {/* Single note */}
                    <View style={[styles.noteContainer]}>
                        <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 15}}>Another note</Text>
                        <Text style={{fontSize: 14, color: '#444', marginBottom: 10}}>Date: 13 Jun, 2024</Text>
                        <View style={[styles.noteBtnContainer]}>
                            <TouchableOpacity
                                style={[styles.noteBtn, styles.noteBtnUpdate]}
                                onPress={() => handleSnapPress(0)}
                            >
                                <MaterialIcons name="note-add" size={20} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.noteBtn, styles.noteBtnDelete]}
                            >
                                <FontAwesome5 name="trash-alt" size={20} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* Single note */}
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
                </BottomSheetView>
            </BottomSheet>
        </GestureHandlerRootView>
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
        padding: 0
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