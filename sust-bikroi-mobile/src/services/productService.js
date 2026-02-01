import api from './api';

const productService = {
    // Get all products
    getAllProducts: async () => {
        const response = await api.get('/product');
        return response.data;
    },

    // Get product by ID
    getProductById: async (id) => {
        const response = await api.get(`/product/${id}`);
        return response.data;
    },

    // Create new product
    createProduct: async (formData) => {
        const response = await api.post('/product', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Update product
    updateProduct: async (id, formData) => {
        const response = await api.patch(`/product/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Delete product
    deleteProduct: async (id) => {
        const response = await api.delete(`/product/${id}`);
        return response.data;
    },

    // Search products
    searchProducts: async (query, category = '') => {
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (category) params.append('category', category);

        const response = await api.get(`/product/search?${params.toString()}`);
        return response.data;
    },

    // Get products by category
    getProductsByCategory: async (category) => {
        const response = await api.get(`/product/category/${category}`);
        return response.data;
    },
};

export default productService;
