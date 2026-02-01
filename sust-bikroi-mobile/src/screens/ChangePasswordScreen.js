import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import authService from '../services/authService';

const ChangePasswordScreen = ({ navigation }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const response = await authService.changePassword(oldPassword, newPassword);
            if (response.success) {
                Alert.alert('Success', 'Password changed successfully', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                Alert.alert('Error', response.message || 'Failed to change password');
            }
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Current Password</Text>
                    <TextInput
                        style={styles.input}
                        value={oldPassword}
                        onChangeText={setOldPassword}
                        placeholder="Enter current password"
                        secureTextEntry
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>New Password</Text>
                    <TextInput
                        style={styles.input}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="Enter new password"
                        secureTextEntry
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Confirm New Password</Text>
                    <TextInput
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirm new password"
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleChangePassword}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Changing...' : 'Change Password'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    formContainer: {
        padding: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    button: {
        backgroundColor: '#4F46E5',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonDisabled: {
        backgroundColor: '#a5b4fc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ChangePasswordScreen;
