import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import {
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const NoteLesson = () => {
    const {id, name} = useLocalSearchParams();

    useEffect(() => {
        console.log(id);
        console.log(name);
    },[])
    return (
        <ScrollView>
            <View style={{marginVertical: 20}}> 
                <Text style={{color: '#0085ff', fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>{name}</Text>
            </View>
            <TouchableOpacity
                style={{
                    width: wp(90),
                    marginBottom: 10,
                    marginHorizontal: 'auto',
                    borderWidth: 1,
                    backgroundColor: '#0085ff',
                    borderColor: 'white',
                    borderRadius: 8,
                    paddingVertical: 8,
                }}
            >
                <Text style={{fontSize: 16, color: 'white', textAlign: 'center'}}>Tạo mới ghi chú</Text>
            </TouchableOpacity>
            <View>
                <View 
                    style={{
                        width: wp(90),
                        marginTop: 20,
                        marginBottom: 10,
                        marginHorizontal: 'auto'
                    }}
                >
                    <Text style={{fontWeight: 'bold', color: '#237867', fontSize: 18, textAlign: 'center'}}>Ghi chú của tôi</Text>
                </View>
                <View
                    style={{
                        width: wp(90),
                        marginBottom: 10,
                        marginHorizontal: 'auto',
                        backgroundColor: '#ccc',
                        height: 120,
                        borderRadius: 8,
                        paddingVertical: 10,
                        paddingHorizontal: 8
                    }}
                >
                    <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 15}}>Another note</Text>
                    <Text style={{fontSize: 14, color: '#444', marginBottom: 10}}>Date: 13 Jun, 2024</Text>
                    <View style={{flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 'auto'}}>
                        <TouchableOpacity
                            style={{
                                width: 30,
                                height: 30,
                                borderRadius: 8,
                                backgroundColor: '#0085ff',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <MaterialIcons name="note-add" size={20} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                width: 30,
                                height: 30,
                                borderRadius: 8,
                                backgroundColor: '#f4f4f4',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <FontAwesome5 name="trash-alt" size={20} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default NoteLesson;