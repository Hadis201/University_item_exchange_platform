import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import authService from '../services/authService';

const VerifyOTPScreen = ({ navigation, route }) => {
    const { email } = route.params;
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerifyOTP = async () => {
        if (!otp || otp.length !== 6) {
            Alert.alert('Error', 'Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            await authService.verifyOTP(email, otp);
            Alert.alert('Success', 'OTP verified successfully', [
                { text: 'OK', onPress: () => navigation.navigate('ResetPassword', { email, otp }) }
            ]);
        } catch (error) {
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Invalid OTP'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.form}>
                <Text style={styles.heading}>Verify OTP</Text>
                <Text style={styles.subheading}>
                    Enter the 6-digit code sent to {email}
                </Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>OTP Code</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChangeText={setOtp}
                        keyboardType="number-pad"
                        maxLength={6}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleVerifyOTP}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f9fafb',
        padding: 20,
        justifyContent: 'center',
    },
    form: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
        textAlign: 'center',
    },
    subheading: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 24,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        padding: 12,
        fontSize: 24,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        textAlign: 'center',
        letterSpacing: 8,
    },
    button: {
        backgroundColor: '#4F46E5',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#9ca3af',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButton: {
        marginTop: 16,
        alignItems: 'center',
    },
    backText: {
        color: '#4F46E5',
        fontSize: 14,
    },
});

export default VerifyOTPScreen;
