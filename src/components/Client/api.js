// src/components/Client/api.js
import { apiRequest } from '../../utils/request';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8090';

export const fetchTags = async () => {
  const res = await apiRequest(`${BASE_URL}/tags`, 'GET');
  return res;
};

export const fetchLives = async () => {
  const res = await apiRequest(`${BASE_URL}/lives`, 'GET');
  return res;
};

export const createLive = async ({ liveId, title, tagName }) => {
  return await apiRequest(`${BASE_URL}/lives`, 'POST', { liveId, title, tagName });
};

export const updateLiveTitle = async (id, title) => {
  return await apiRequest(`${BASE_URL}/lives/${id}`, 'PUT', { title });
};

export const updateLiveTag = async (id, tagName) => {
  return await apiRequest(`${BASE_URL}/lives/${id}/tag`, 'PUT', { tagName });
};

export const deleteLiveById = async (id) => {
  return await apiRequest(`${BASE_URL}/lives/${id}`, 'DELETE');
};

export const fetchComments = async (liveId) => {
  const res = await apiRequest(`${BASE_URL}/comments/${liveId}`, 'GET');
  return res;
};