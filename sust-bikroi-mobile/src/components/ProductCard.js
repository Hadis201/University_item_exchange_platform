import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const ProductCard = ({ product, onPress }) => {
    const imageUrl = product.images?.[0] || 'https://via.placeholder.com/150';

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>
                    {product.title}
                </Text>
                <Text style={styles.price}>৳{product.price}</Text>
                <Text style={styles.condition}>{product.condition}</Text>
                <Text style={styles.seller} numberOfLines={1}>
                    {product.seller?.fullName || 'Unknown Seller'}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    content: {
        padding: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4F46E5',
        marginBottom: 4,
    },
    condition: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 4,
        textTransform: 'capitalize',
    },
    seller: {
        fontSize: 12,
        color: '#9ca3af',
    },
});

export default ProductCard;
