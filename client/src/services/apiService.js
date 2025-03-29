// src/apiService.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api/challenges'; // Adjust the port if needed

// Create a new challenge with image upload
export const createChallenge = async (formData) => {
  try {
    const response = await axios.post(API_BASE_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating challenge:', error.response?.data || error.message);
    throw error;
  }
};

// Get all challenges
export const getChallenges = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching challenges:', error.response?.data || error.message);
    throw error;
  }
};

// Get a specific challenge by ID
export const getChallengeById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching challenge:', error.response?.data || error.message);
    throw error;
  }
};

// Update a challenge (with image upload)
export const updateChallenge = async (id, formData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating challenge:', error.response?.data || error.message);
    throw error;
  }
};

// Delete a challenge
export const deleteChallenge = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting challenge:', error.response?.data || error.message);
    throw error;
  }
};

// User joins a challenge
export const joinChallenge = async (id) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${id}/join`);
    return response.data;
  } catch (error) {
    console.error('Error joining challenge:', error.response?.data || error.message);
    throw error;
  }
};

// User leaves a challenge
export const leaveChallenge = async (id) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${id}/leave`);
    return response.data;
  } catch (error) {
    console.error('Error leaving challenge:', error.response?.data || error.message);
    throw error;
  }
};

// Get leaderboard rankings
export const getLeaderboard = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/leaderboard`);
    return response.data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error.response?.data || error.message);
    throw error;
  }
};

// Mark challenge as complete (assign points & rewards)
export const completeChallenge = async (id) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${id}/complete`);
    return response.data;
  } catch (error) {
    console.error('Error completing challenge:', error.response?.data || error.message);
    throw error;
  }
};
