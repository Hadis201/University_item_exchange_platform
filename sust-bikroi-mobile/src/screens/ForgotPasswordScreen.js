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

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }

        setLoading(true);
        try {
            await authService.forgotPassword(email);
            Alert.alert('Success', 'OTP sent to your email', [
                { text: 'OK', onPress: () => navigation.navigate('VerifyOTP', { email }) }
            ]);
        } catch (error) {
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Could not send OTP'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.form}>
                <Text style={styles.heading}>Forgot Password?</Text>
                <Text style={styles.subheading}>
                    Enter your email to receive an OTP
                </Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleForgotPassword}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Sending OTP...' : 'Send OTP'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backText}>Back to Login</Text>
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
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
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

export default ForgotPasswordScreen;
