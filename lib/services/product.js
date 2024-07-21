// /lib/services/product.js
import api from '../api';

export const createProduct = (data) => api.post('/api/product/productCreate', data);
export const getUserProductsByCategory = (data) => api.post('/api/product/getUserProductsByCategory', data);
export const getAllUserProducts = () => api.post('/api/product/getAllUserProducts');
export const findItemById = (data) => api.post('/api/product/findItemById', data);
export const setProductStatus = (data) => api.put('/api/product/setProductStatus', data);
export const deleteItemById = (data) => api.delete('/api/product/deleteItemById', { data });
export const updateProductItem = (data) => api.put('/api/product/updateProductItem', data);
// export const generateLinkForActiveProducts = (query) => api.post(`/api/product/generateLinkForActiveProducts?category=${query}`);
// export const generateQRCodeForLink = (data) => api.post('/api/product/generateQRCodeForLink', data);
// export const generateQRCodePDF = async (data) => {
//     const response = await api.post('/api/product/generateQRCodePDF', data, {
//       responseType: 'blob',
//     });
//     return response;
// }


export const getActiveProductsByCategory = (categories) => api.post(`/api/product/active?category=${categories}`);
  
export const reorderProducts = async (reorderedProducts) => {
  return await api.put('/api/product/reorderProducts', reorderedProducts );
};
export const liveSearch = (data) => api.post('/api/product/liveSearch', data);
