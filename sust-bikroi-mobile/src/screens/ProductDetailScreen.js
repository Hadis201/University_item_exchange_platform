import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Alert,
    Linking,
} from 'react-native';
import productService from '../services/productService';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ navigation, route }) => {
    const { productId } = route.params;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { user } = useAuth();

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const fetchProduct = async () => {
        try {
            const response = await productService.getProductById(productId);
            setProduct(response.data);
        } catch (error) {
            Alert.alert('Error', 'Could not load product details');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        Alert.alert(
            'Delete Product',
            'Are you sure you want to delete this product?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await productService.deleteProduct(productId);
                            Alert.alert('Success', 'Product deleted successfully');
                            navigation.goBack();
                        } catch (error) {
                            Alert.alert('Error', 'Could not delete product');
                        }
                    },
                },
            ]
        );
    };

    const handleContactSeller = () => {
        if (product?.seller?.email) {
            Linking.openURL(`mailto:${product.seller.email}`);
        }
    };

    const handleChat = () => {
        navigation.navigate('Chat', { sellerId: product.seller._id });
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!product) {
        return null;
    }

    const isOwner = user?._id === product.seller?._id;

    return (
        <ScrollView style={styles.container}>
            {/* Image Carousel */}
            <View style={styles.imageContainer}>
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(e) => {
                        const index = Math.round(
                            e.nativeEvent.contentOffset.x / width
                        );
                        setCurrentImageIndex(index);
                    }}
                >
                    {product.images?.map((image, index) => (
                        <Image
                            key={index}
                            source={{ uri: image }}
                            style={styles.image}
                        />
                    ))}
                </ScrollView>
                <View style={styles.pagination}>
                    {product.images?.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.paginationDot,
                                index === currentImageIndex && styles.paginationDotActive,
                            ]}
                        />
                    ))}
                </View>
            </View>

            {/* Product Info */}
            <View style={styles.content}>
                <Text style={styles.title}>{product.title}</Text>
                <Text style={styles.price}>৳{product.price}</Text>
                <View style={styles.badges}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{product.category}</Text>
                    </View>
                    <View style={[styles.badge, styles.badgeCondition]}>
                        <Text style={styles.badgeText}>{product.condition}</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{product.description}</Text>

                <Text style={styles.sectionTitle}>Seller Information</Text>
                <View style={styles.sellerCard}>
                    {product.seller?.avatar && (
                        <Image
                            source={{ uri: product.seller.avatar }}
                            style={styles.sellerAvatar}
                        />
                    )}
                    <View style={styles.sellerInfo}>
                        <Text style={styles.sellerName}>{product.seller?.fullName}</Text>
                        <Text style={styles.sellerEmail}>{product.seller?.email}</Text>
                    </View>
                </View>

                {/* Action Buttons */}
                {!isOwner ? (
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonSecondary]}
                            onPress={handleContactSeller}
                        >
                            <Text style={styles.buttonTextSecondary}>📧 Email</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleChat}
                        >
                            <Text style={styles.buttonText}>💬 Chat</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonEdit]}
                            onPress={() => navigation.navigate('SellPost', { editProductId: product._id })}
                        >
                            <Text style={styles.buttonText}>✏️ Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonDelete]}
                            onPress={handleDelete}
                        >
                            <Text style={styles.buttonText}>🗑️ Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: width,
        height: 300,
        resizeMode: 'cover',
    },
    pagination: {
        position: 'absolute',
        bottom: 16,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.5)',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: '#fff',
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
    },
    price: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4F46E5',
        marginBottom: 12,
    },
    badges: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    badge: {
        backgroundColor: '#e0e7ff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
    },
    badgeCondition: {
        backgroundColor: '#d1fae5',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
        textTransform: 'capitalize',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
        marginTop: 16,
    },
    description: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 22,
    },
    sellerCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sellerAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    sellerInfo: {
        justifyContent: 'center',
    },
    sellerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    sellerEmail: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    },
    actions: {
        flexDirection: 'row',
        marginTop: 24,
        marginBottom: 20,
    },
    button: {
        flex: 1,
        backgroundColor: '#4F46E5',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    buttonSecondary: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#4F46E5',
    },
    buttonEdit: {
        backgroundColor: '#2563eb', // Blue color for edit
    },
    buttonDelete: {
        backgroundColor: '#dc2626',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonTextSecondary: {
        color: '#4F46E5',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProductDetailScreen;
