import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { theme } from '../utils/theme';

const SignupScreen = ({ navigation }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Permission Required', 'Camera roll permission is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0]);
        }
    };

    const handleSignup = async () => {
        if (!fullName || !email || !password) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('fullName', fullName);
            formData.append('email', email);
            formData.append('password', password);

            if (avatar) {
                formData.append('avatar', {
                    uri: avatar.uri,
                    type: 'image/jpeg',
                    name: 'avatar.jpg',
                });
            }

            await register(formData);
            // Navigation handled automatically by AppNavigator
        } catch (error) {
            Alert.alert(
                'Signup Failed',
                error.response?.data?.message || 'Could not create account'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.form}>
                    <Text style={styles.heading}>Create Account</Text>
                    <Text style={styles.subheading}>Join SUST Bikroi Today</Text>

                    <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
                        {avatar ? (
                            <Image source={{ uri: avatar.uri }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarText}>Add Photo</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your full name"
                            placeholderTextColor={theme.colors.outline}
                            value={fullName}
                            onChangeText={setFullName}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            placeholderTextColor={theme.colors.outline}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter password"
                            placeholderTextColor={theme.colors.outline}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm Password *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm password"
                            placeholderTextColor={theme.colors.outline}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleSignup}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginLink}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: theme.colors.background,
        padding: 20,
        paddingTop: 40,
    },
    form: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.shape.large,
        padding: 24,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: theme.elevation.level2,
    },
    heading: {
        fontSize: theme.typography.headlineMedium.fontSize,
        fontWeight: 'bold',
        color: theme.colors.onSurface,
        marginBottom: 8,
        textAlign: 'center',
    },
    subheading: {
        fontSize: theme.typography.bodyLarge.fontSize,
        color: theme.colors.onSurfaceVariant,
        marginBottom: 24,
        textAlign: 'center',
    },
    avatarContainer: {
        alignSelf: 'center',
        marginBottom: 24,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: theme.shape.full,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: theme.shape.full,
        backgroundColor: theme.colors.surfaceVariant,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.primary,
        borderStyle: 'dashed',
    },
    avatarText: {
        color: theme.colors.primary,
        fontSize: theme.typography.labelLarge.fontSize,
        fontWeight: '600',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: theme.typography.labelLarge.fontSize,
        fontWeight: '600',
        color: theme.colors.onSurface,
        marginBottom: 8,
    },
    input: {
        backgroundColor: theme.colors.surfaceVariant,
        borderRadius: theme.shape.small,
        padding: 12,
        fontSize: theme.typography.bodyLarge.fontSize,
        color: theme.colors.onSurfaceVariant,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
    },
    button: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.shape.full,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
        elevation: theme.elevation.level1,
    },
    buttonDisabled: {
        backgroundColor: theme.colors.onSurfaceVariant,
        opacity: 0.12,
    },
    buttonText: {
        color: theme.colors.onPrimary,
        fontSize: theme.typography.labelLarge.fontSize,
        fontWeight: 'bold',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    loginText: {
        color: theme.colors.onSurfaceVariant,
        fontSize: theme.typography.bodyMedium.fontSize,
    },
    loginLink: {
        color: theme.colors.primary,
        fontSize: theme.typography.bodyMedium.fontSize,
        fontWeight: 'bold',
    },
});

export default SignupScreen;
