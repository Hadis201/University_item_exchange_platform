import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../utils/theme';

const LoginScreen = ({ navigation }) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!userName || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await login(userName, password);
            // Navigation handled automatically by AppNavigator
        } catch (error) {
            console.error(error);
            let message = 'Invalid credentials';
            if (error.response) {
                message = error.response.data?.message || 'Server error';
            } else if (error.request) {
                message = 'Network error. Check your internet connection or API URL.';
            } else {
                message = error.message;
            }

            Alert.alert('Login Failed', message);
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
                    <Text style={styles.heading}>Welcome Back!</Text>
                    <Text style={styles.subheading}>Login to SUST Bikroi</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your username"
                            placeholderTextColor={theme.colors.outline}
                            value={userName}
                            onChangeText={setUserName}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your password"
                            placeholderTextColor={theme.colors.outline}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('ForgotPassword')}
                    >
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Logging in...' : 'Login'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text style={styles.signupLink}>Sign Up</Text>
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
        justifyContent: 'center',
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
    forgotText: {
        color: theme.colors.primary,
        fontSize: theme.typography.labelLarge.fontSize,
        textAlign: 'right',
        marginBottom: 20,
        fontWeight: '500',
    },
    button: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.shape.full, // Pill shape
        padding: 16,
        alignItems: 'center',
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
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    signupText: {
        color: theme.colors.onSurfaceVariant,
        fontSize: theme.typography.bodyMedium.fontSize,
    },
    signupLink: {
        color: theme.colors.primary,
        fontSize: theme.typography.bodyMedium.fontSize,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
