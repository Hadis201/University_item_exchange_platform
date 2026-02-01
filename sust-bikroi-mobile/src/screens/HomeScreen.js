import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    RefreshControl,
    Alert,
} from 'react-native';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await productService.getAllProducts();
            setProducts(response.data.items || []);
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

    const categories = [
        { id: 'Electronics', name: 'Electronics', icon: '📱' },
        { id: 'Books', name: 'Books', icon: '📚' },
        { id: 'Furniture', name: 'Furniture', icon: '🪑' },
        { id: 'Clothing', name: 'Clothing', icon: '👕' },
        { id: 'Sports', name: 'Sports', icon: '⚽' },
        { id: 'Other', name: 'Other', icon: '📦' },
    ];

    return (
        <View style={styles.container}>
            {/* Header with user greeting */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello, {user?.fullName}!</Text>
                    <Text style={styles.subtitle}>Find great deals on campus</Text>
                </View>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => navigation.navigate('Profile')}
                >
                    <Text style={styles.profileIcon}>👤</Text>
                </TouchableOpacity>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('SellPost')}
                >
                    <Text style={styles.actionIcon}>➕</Text>
                    <Text style={styles.actionText}>Sell Item</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Search')}
                >
                    <Text style={styles.actionIcon}>🔍</Text>
                    <Text style={styles.actionText}>Search</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Products')}
                >
                    <Text style={styles.actionIcon}>📦</Text>
                    <Text style={styles.actionText}>All Items</Text>
                </TouchableOpacity>
            </View>

            {/* Categories */}
            <Text style={styles.sectionTitle}>Categories</Text>
            <FlatList
                horizontal
                data={categories}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesList}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.categoryCard}
                        onPress={() => navigation.navigate('Category', { category: item.id })}
                    >
                        <Text style={styles.categoryIcon}>{item.icon}</Text>
                        <Text style={styles.categoryName}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />

            {/* Recent Products */}
            <Text style={styles.sectionTitle}>Recent Listings</Text>
            <FlatList
                data={products.slice(0, 10)}
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 4,
    },
    profileButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4F46E5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileIcon: {
        fontSize: 20,
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 4,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    actionIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    actionText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 12,
        marginTop: 8,
    },
    categoriesList: {
        marginBottom: 20,
    },
    categoryCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginRight: 12,
        alignItems: 'center',
        width: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    categoryIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    categoryName: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
        textAlign: 'center',
    },
    emptyText: {
        textAlign: 'center',
        color: '#6b7280',
        marginTop: 40,
    },
});

export default HomeScreen;
