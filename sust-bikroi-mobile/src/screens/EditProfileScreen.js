import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const EditProfileScreen = ({ navigation }) => {
    const { user, updateUser } = useAuth();
    const [fullName, setFullName] = useState(user?.fullName || '');
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
    const [studentId, setStudentId] = useState(user?.studentId || '');
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        if (!fullName || !phoneNumber || !studentId) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await authService.updateProfile({
                fullName,
                phoneNumber,
                studentId,
            });

            if (response.success) {
                // Update context
                if (updateUser) {
                    updateUser(response.data);
                }
                Alert.alert('Success', 'Profile updated successfully', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                Alert.alert('Error', response.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="Enter your full name"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                        style={styles.input}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        placeholder="Enter your phone number"
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Student ID</Text>
                    <TextInput
                        style={styles.input}
                        value={studentId}
                        onChangeText={setStudentId}
                        placeholder="Enter your student ID"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={[styles.input, styles.disabledInput]}
                        value={user?.email}
                        editable={false}
                    />
                    <Text style={styles.helpText}>Email cannot be changed</Text>
                </View>

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleUpdate}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Updating...' : 'Update Profile'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
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
    disabledInput: {
        backgroundColor: '#f3f4f6',
        color: '#9ca3af',
    },
    helpText: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 4,
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

export default EditProfileScreen;
