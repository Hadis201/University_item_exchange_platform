import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { theme } from '../utils/theme';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.content}>
                        <Text style={styles.title}>Oops! Something went wrong.</Text>
                        <Text style={styles.message}>
                            We're sorry, but the application encountered an unexpected error.
                        </Text>
                        <Text style={styles.errorText}>
                            {this.state.error?.toString()}
                        </Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={this.props.onReset || this.handleReset}
                        >
                            <Text style={styles.buttonText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 24,
        alignItems: 'center',
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.onBackground,
        marginBottom: 16,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: theme.colors.onSurfaceVariant,
        textAlign: 'center',
        marginBottom: 24,
    },
    errorText: {
        fontSize: 12,
        color: theme.colors.error,
        textAlign: 'center',
        marginBottom: 32,
        fontFamily: 'monospace',
        backgroundColor: theme.colors.errorContainer,
        padding: 8,
        borderRadius: 4,
    },
    button: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: theme.shape.full,
        elevation: 2,
    },
    buttonText: {
        color: theme.colors.onPrimary,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ErrorBoundary;
