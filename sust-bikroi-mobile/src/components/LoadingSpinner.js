import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingSpinner = ({ size = 'large', color = '#4F46E5' }) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={color} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
    },
});

export default LoadingSpinner;
