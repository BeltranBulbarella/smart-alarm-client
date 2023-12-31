import {Alert, Modal, Pressable, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import {colorPalette} from "../../../common/constants/ColorPalette";
import {Switch} from "react-native-switch";
import {getDayByNumber} from "../../../../models/alarm";
import React, {useEffect, useState} from "react";
import {addLeadingZeros} from "../../Alarm";
import {useToggleAlarm} from "../../../../hooks/useToggleAlarm";
import {useDeleteAlarm} from "../../../../hooks/useDeleteAlarm";

const SmartAlarm = (props: any) => {

    const [isEnabled, setIsEnabled] = useState(props.alarm.isActive);
    const [modalVisible, setModalVisible] = useState(false);
    const [alarmId, setAlarmId] = useState('')

    useEffect(() => {
        setIsEnabled(props.alarm.isActive)
    }, [props])

    const {deleteAlarm} = useDeleteAlarm(alarmId, !!props.alarm.preparationTime,
        {
            onCompleted: () => {
                props.deleteAlarm()
            },
            onError: (error: any) => {
                console.log('errror', error)
            }
        })

    const onLongPressButton = () => {
        setModalVisible(true)
        setAlarmId(props.alarm.id)
    }
    console.log(props.alarm.arrivalTime)
    return (
        <TouchableHighlight onLongPress={onLongPressButton} underlayColor={colorPalette.secondary_dark}>
            <>
                <View
                    style={[styles.container, isEnabled ? {backgroundColor: colorPalette.secondary_dark} : {backgroundColor: colorPalette.dark}]}>
                    <View style={styles.rowContainer}>
                        <View style={styles.arrivalTime}>
                            <Text style={[styles.textLabel, isEnabled ? styles.enabledColor : styles.disabledColor]}>
                                Arrival Time
                            </Text>
                            <Text
                                style={[styles.text, isEnabled ? styles.enabledColor : styles.disabledColor]}>
                                {`${addLeadingZeros(new Date(props.alarm.arrivalTime).getHours())}:${addLeadingZeros(new Date(props.alarm.arrivalTime).getMinutes())}`}
                            </Text>
                        </View>
                        <View style={{flexDirection: "column"}}>
                            <Text style={[styles.textLabel, isEnabled ? styles.enabledColor : styles.disabledColor]}>
                                Preparation Time
                            </Text>
                            <View style={{flexDirection: "row", alignItems: 'center'}}>
                                <Text
                                    style={[styles.text, isEnabled ? styles.enabledColor : styles.disabledColor]}>
                                    {props.alarm.preparationTime}
                                </Text>
                                <Text style={[{fontSize: 10}, isEnabled ? styles.enabledColor : styles.disabledColor]}>
                                    minutes
                                </Text>
                            </View>
                        </View>
                        <Switch
                            backgroundActive={colorPalette.secondary_shadow}
                            backgroundInactive='gray'
                            circleActiveColor={colorPalette.primary_shadow}
                            circleBorderWidth={0}
                            renderActiveText={false}
                            renderInActiveText={false}
                            onValueChange={() => {
                                setIsEnabled(!isEnabled)
                                useToggleAlarm('smart', props.alarm.id)
                            }}
                            value={isEnabled}
                        />
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingLeft: 5,
                        paddingRight: 30
                    }}>
                        <Text style={[styles.textName, isEnabled ? styles.enabledColor : styles.disabledColor]}>
                            {props.alarm.name}
                        </Text>
                    </View>
                </View>
                <View style={styles.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>Do you want to delete alarm?</Text>
                                <View style={{flexDirection: "row"}}>
                                    <View style={{flexDirection: "column", justifyContent: 'center', flex: 5}}>
                                        <Pressable style={styles.yesNoPressable} onPress={() => {
                                            deleteAlarm()
                                            setModalVisible(!modalVisible)
                                        }}>
                                            <Text>Yes</Text>
                                        </Pressable>
                                    </View>
                                    <View style={{flexDirection: "column", justifyContent: 'center', flex: 1}}/>
                                    <View style={{flexDirection: "column", justifyContent: 'center', flex: 5}}>
                                        <Pressable style={styles.yesNoPressable}
                                                   onPress={() => setModalVisible(!modalVisible)}>
                                            <Text>No</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            </>
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 100,
        margin: 10,
        borderRadius: 20,
        padding: 5,
    },

    rowContainer: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    text: {
        fontSize: 25,
        marginBottom: 10,
    },

    textName: {
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 10,
    },
    textLabel: {
        fontSize: 10,
        marginLeft: 5,
        marginTop: 10
    },

    disabledColor: {
        color: '#aaa',
        fontWeight: '200'
    },

    enabledColor: {
        color: '#ccc',
        fontWeight: '300'
    },
    arrivalTime: {
        flexDirection: "column"
    },
    yesNoPressable: {
        borderRadius: 20,
        padding: 10,
        backgroundColor: colorPalette.primary,
        display: 'flex',
        alignItems: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 20
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },

})
export default SmartAlarm
