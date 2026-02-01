import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';

// Auth Screens
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import VerifyOTPScreen from '../screens/VerifyOTPScreen';

// Main Screens
import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SellPostScreen from '../screens/SellPostScreen';
import SearchScreen from '../screens/SearchScreen';
import CategoryScreen from '../screens/CategoryScreen';
import ChatScreen from '../screens/ChatScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';

const Stack = createStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#4F46E5',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ title: 'SUST Bikroi - Login' }}
            />
            <Stack.Screen
                name="Signup"
                component={SignupScreen}
                options={{ title: 'Create Account' }}
            />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                options={{ title: 'Forgot Password' }}
            />
            <Stack.Screen
                name="VerifyOTP"
                component={VerifyOTPScreen}
                options={{ title: 'Verify OTP' }}
            />
            <Stack.Screen
                name="ResetPassword"
                component={ResetPasswordScreen}
                options={{ title: 'Reset Password' }}
            />
        </Stack.Navigator>
    );
};

const MainStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#4F46E5',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'SUST Bikroi' }}
            />
            <Stack.Screen
                name="Products"
                component={ProductsScreen}
                options={{ title: 'All Products' }}
            />
            <Stack.Screen
                name="ProductDetail"
                component={ProductDetailScreen}
                options={{ title: 'Product Details' }}
            />
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'My Profile' }}
            />
            <Stack.Screen
                name="SellPost"
                component={SellPostScreen}
                options={{ title: 'Sell Item' }}
            />
            <Stack.Screen
                name="Search"
                component={SearchScreen}
                options={{ title: 'Search Products' }}
            />
            <Stack.Screen
                name="Category"
                component={CategoryScreen}
                options={{ title: 'Category' }}
            />
            <Stack.Screen
                name="Chat"
                component={ChatScreen}
                options={{ title: 'Chat' }}
            />
            <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{ title: 'Edit Profile' }}
            />
            <Stack.Screen
                name="ChangePassword"
                component={ChangePasswordScreen}
                options={{ title: 'Change Password' }}
            />
        </Stack.Navigator>
    );
};

const AppNavigator = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return null; // or a loading screen component
    }

    return (
        <NavigationContainer>
            {user ? <MainStack /> : <AuthStack />}
        </NavigationContainer>
    );
};

export default AppNavigator;
