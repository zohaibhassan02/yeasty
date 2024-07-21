import api from '../api';

export const signIn = (data) => api.post('/api/subuser/subUserSignIn', data);
export const signOut = () => api.post('/api/subuser/subUserSignOut');
export const requestPasswordReset = (data) => api.post('/api/subuser/requestPasswordReset', data);
export const resetPassword = (token, data) => api.put(`/api/subuser/resetPassword/${token}`, data);
export const changePassword = (data) => api.put('/api/subuser/changePassword', data);
export const getSubUserById = (data) => api.post('/api/subuser/getSubUserById', data);
