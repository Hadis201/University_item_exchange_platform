import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Alert,
} from 'react-native';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const CategoryScreen = ({ navigation, route }) => {
    const { category } = route.params;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, [category]);

    const fetchProducts = async () => {
        try {
            const response = await productService.searchProducts('', category);
            setProducts(response.data || []);
        } catch (error) {
            Alert.alert('Error', 'Could not load products');
        } finally {
            setLoading(false);
        }
    };

    const handleProductPress = (product) => {
        navigation.navigate('ProductDetail', { productId: product._id });
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>{category}</Text>
            <FlatList
                data={products}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <ProductCard
                        product={item}
                        onPress={() => handleProductPress(item)}
                    />
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        No products in this category
                    </Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
        padding: 16,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 16,
    },
    emptyText: {
        textAlign: 'center',
        color: '#6b7280',
        marginTop: 40,
        fontSize: 16,
    },
});

export default CategoryScreen;
