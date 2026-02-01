import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    RefreshControl,
    Alert,
} from 'react-native';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductsScreen = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await productService.getAllProducts();
            setProducts(response.data || []);
        } catch (error) {
            Alert.alert('Error', 'Could not load products');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchProducts();
    };

    const handleProductPress = (product) => {
        navigation.navigate('ProductDetail', { productId: product._id });
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <ProductCard
                        product={item}
                        onPress={() => handleProductPress(item)}
                    />
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No products available</Text>
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
    emptyText: {
        textAlign: 'center',
        color: '#6b7280',
        marginTop: 40,
        fontSize: 16,
    },
});

export default ProductsScreen;
