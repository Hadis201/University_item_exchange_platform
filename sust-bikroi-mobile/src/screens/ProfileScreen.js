import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import productService from '../services/productService';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfileScreen = ({ navigation }) => {
    const { user, logout } = useAuth();
    const [userProducts, setUserProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserProducts();
    }, []);

    const fetchUserProducts = async () => {
        try {
            const response = await productService.getAllProducts();
            const myProducts = response.data?.filter(
                (product) => product.seller._id === user._id
            ) || [];
            setUserProducts(myProducts);
        } catch (error) {
            Alert.alert('Error', 'Could not load your products');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    await logout();
                },
            },
        ]);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.profileCard}>
                {user?.avatar ? (
                    <Image source={{ uri: user.avatar }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>
                            {user?.fullName?.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                )}
                <Text style={styles.name}>{user?.fullName}</Text>
                <Text style={styles.email}>{user?.email}</Text>

                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('EditProfile')}
                    >
                        <Text style={styles.actionButtonText}>Edit Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('ChangePassword')}
                    >
                        <Text style={styles.actionButtonText}>Change Password</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.statsCard}>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>{userProducts.length}</Text>
                    <Text style={styles.statLabel}>Listed Items</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>My Listings</Text>
            <FlatList
                data={userProducts}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.productItem}
                        onPress={() =>
                            navigation.navigate('ProductDetail', { productId: item._id })
                        }
                    >
                        <Image
                            source={{ uri: item.images?.[0] || 'https://via.placeholder.com/80' }}
                            style={styles.productImage}
                        />
                        <View style={styles.productInfo}>
                            <Text style={styles.productTitle} numberOfLines={1}>
                                {item.title}
                            </Text>
                            <Text style={styles.productPrice}>৳{item.price}</Text>
                            <Text style={styles.productCondition}>{item.condition}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>You haven't listed any items yet</Text>
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
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#4F46E5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarText: {
        color: '#fff',
        fontSize: 40,
        fontWeight: 'bold',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 16,
    },
    actionButtons: {
        width: '100%',
        marginBottom: 16,
    },
    actionButton: {
        backgroundColor: '#e0e7ff',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 8,
    },
    actionButtonText: {
        color: '#4F46E5',
        fontSize: 16,
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: '#dc2626',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        width: '100%',
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    statsCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    stat: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4F46E5',
    },
    statLabel: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 12,
    },
    productItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    productInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    productTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4F46E5',
        marginBottom: 2,
    },
    productCondition: {
        fontSize: 12,
        color: '#6b7280',
    },
    emptyText: {
        textAlign: 'center',
        color: '#6b7280',
        marginTop: 40,
        fontSize: 16,
    },
});

export default ProfileScreen;
