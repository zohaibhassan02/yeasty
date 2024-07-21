import api from '../api';

export const signUp = (data) => api.post('/api/user/userSignUp', data);
export const signIn = (data) => api.post('/api/user/userSignIn', data);
export const signOut = () => api.post('/api/user/userSignOut');
export const requestPasswordReset = (data) => api.post('/api/user/requestPasswordReset', data);
export const resetPassword = (token, data) => api.put(`/api/user/resetPassword?token=${token}`, data);
export const changePassword = (data) => api.put('/api/user/changePassword', data);
export const editProfile = (data) => api.put('/api/user/userEditProfile', data);
export const inviteSubUser = (data) => api.post('/api/user/inviteSubUser', data);
export const toggleSubUserStatus = (data) => api.put('/api/user/toggleSubUserStatus', data);
export const getUserInfo = () => api.post('/api/user/getUserInfo');
export const verifyToken = () => api.post(`/api/user/verifyToken`);
