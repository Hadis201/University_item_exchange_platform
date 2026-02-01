import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const SearchScreen = ({ navigation }) => {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const categories = ['All', 'Electronics', 'Books', 'Furniture', 'Clothing', 'Sports', 'Other'];

    const handleSearch = async () => {
        if (!query.trim() && !category) {
            Alert.alert('Error', 'Please enter a search term or select a category');
            return;
        }

        setLoading(true);
        try {
            const response = await productService.searchProducts(
                query,
                category === 'All' ? '' : category
            );
            setResults(response.data || []);
        } catch (error) {
            Alert.alert('Error', 'Could not perform search');
        } finally {
            setLoading(false);
        }
    };

    const handleProductPress = (product) => {
        navigation.navigate('ProductDetail', { productId: product._id });
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Search for products..."
                    value={query}
                    onChangeText={setQuery}
                    onSubmitEditing={handleSearch}
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>🔍</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.label}>Filter by Category</Text>
            <FlatList
                horizontal
                data={categories}
                keyExtractor={(item) => item}
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesList}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.categoryButton,
                            category === item && styles.categoryButtonSelected,
                        ]}
                        onPress={() => {
                            setCategory(item === 'All' ? '' : item);
                            if (query.trim()) {
                                handleSearch();
                            }
                        }}
                    >
                        <Text
                            style={[
                                styles.categoryText,
                                category === item && styles.categoryTextSelected,
                            ]}
                        >
                            {item}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            {loading ? (
                <LoadingSpinner />
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <ProductCard
                            product={item}
                            onPress={() => handleProductPress(item)}
                        />
                    )}
                    ListEmptyComponent={
                        query || category ? (
                            <Text style={styles.emptyText}>No results found</Text>
                        ) : (
                            <Text style={styles.emptyText}>
                                Search for products or select a category
                            </Text>
                        )
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
        padding: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    input: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        marginRight: 8,
    },
    searchButton: {
        backgroundColor: '#4F46E5',
        borderRadius: 8,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchButtonText: {
        fontSize: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    categoriesList: {
        marginBottom: 16,
    },
    categoryButton: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
    },
    categoryButtonSelected: {
        backgroundColor: '#4F46E5',
        borderColor: '#4F46E5',
    },
    categoryText: {
        color: '#6b7280',
        fontSize: 14,
        fontWeight: '600',
    },
    categoryTextSelected: {
        color: '#fff',
    },
    emptyText: {
        textAlign: 'center',
        color: '#6b7280',
        marginTop: 40,
        fontSize: 16,
    },
});

export default SearchScreen;
