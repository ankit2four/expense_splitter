import axios from "axios";

const API_URL = process.env.REACT_APP_API_BASE_URL + "/groups";

// Fetch all groups
const getGroups = async () => {
  try {
    const response = await axios.get(API_URL, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error fetching groups:", error.response?.data || error.message);
    throw error;
  }
};

// Create a new group
const createGroup = async (groupData) => {
  try {
    const response = await axios.post(API_URL, groupData, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error creating group:", error.response?.data || error.message);
    throw error;
  }
};

// Add a member to a group
const addMember = async (groupId, email) => {
  try {
    const response = await axios.post(`${API_URL}/${groupId}/members`, { email }, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error adding member:", error.response?.data || error.message);
    throw error;
  }
};

// Remove a member from a group
const removeMember = async (groupId, memberId) => {
  try {
    await axios.delete(`${API_URL}/${groupId}/members/${memberId}`, { withCredentials: true });
  } catch (error) {
    console.error("Error removing member:", error.response?.data || error.message);
    throw error;
  }
};

// Pin/Unpin a group
const pinGroup = async (groupId) => {
  try {
    const response = await axios.put(`${API_URL}/${groupId}/pin`, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error pinning group:", error.response?.data || error.message);
    throw error;
  }
};

// Delete a group
const deleteGroup = async (groupId) => {
  try {
    await axios.delete(`${API_URL}/${groupId}`, { withCredentials: true });
  } catch (error) {
    console.error("Error deleting group:", error.response?.data || error.message);
    throw error;
  }
};

const groupService = { getGroups, createGroup, addMember, removeMember, pinGroup, deleteGroup };
export default groupService;
