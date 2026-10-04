import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';

export default function Otp() {
    const [count, setCount] = useState(0);

    useEffect(() => {
    console.log('Effect');
    }, [count]);


    return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Account Verification</Text>
        <View style = {styles.otpInputContainer}>
            <InputField
            variant="filled"
            keyBoarType="number-pad"
            maxLength={1}
            textAlign="center"
            style = {styles.otpInput}
            />
            <InputField 
            variant="filled"
            keyBoarType="number-pad"
            maxLength={1}
            textAlign="center"
            style = {styles.otpInput}
            />
            <InputField
            variant="filled"
            keyBoarType="number-pad"
            maxLength={1}
            textAlign="center"
            style = {styles.otpInput}
            />
            <InputField
            variant="filled"
            keyBoarType="number-pad"
            maxLength={1}
            textAlign="center"
            style = {styles.otpInputWidth}
            />

        </View>

        <View>
            <CustomButton
            title= {"Verify"}
            onPress={() => { router.push("/movies"), console.log('Verify pressed'); }}/>
            <Text style={{color: '#FFFFFF', textAlign: 'center', marginTop: 10}}>Didn't receive the code? <Text style={{color: '#FF4655'}}>Resend</Text></Text>
        </View>

        <Text style= {styles.count}>{count}</Text>
        <CustomButton title={"Increase Count"} onPress={() => setCount(count + 1)} />

    </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#101113',
        justifyContent: 'center',
        padding: 80,
        overflow: 'hidden',
},
    title: {
        fontSize: 30,
        fontWeight: '900',
        textAlign: 'center',
        color: '#FF4655',
        letterSpacing: 3,
    },
    count: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#FFFFFF',
        marginTop: 30,
    },
    otpInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 1,
    },
    otpInputWidth: {
        width: 50,
    },
});