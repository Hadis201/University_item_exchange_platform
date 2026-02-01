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

const ResetPasswordScreen = ({ navigation, route }) => {
    const { email, otp } = route.params;
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword(email, otp, newPassword);
            Alert.alert('Success', 'Password reset successfully', [
                { text: 'OK', onPress: () => navigation.navigate('Login') }
            ]);
        } catch (error) {
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Could not reset password'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.form}>
                <Text style={styles.heading}>Reset Password</Text>
                <Text style={styles.subheading}>Enter your new password</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>New Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleResetPassword}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </Text>
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
        marginTop: 8,
    },
    buttonDisabled: {
        backgroundColor: '#9ca3af',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ResetPasswordScreen;
