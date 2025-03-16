import axios from "axios";

const API_URL = process.env.REACT_APP_API_BASE_URL + "/expenses";

// Fetch expenses for a specific group
const getExpenses = async (groupId) => {
  try {
    const response = await axios.get(`${API_URL}/group/${groupId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error fetching expenses:", error.response?.data || error.message);
    throw error;
  }
};

// Add a new expense
const addExpense = async (expenseData) => {
  try {
    const response = await axios.post(API_URL, expenseData, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error adding expense:", error.response?.data || error.message);
    throw error;
  }
};

// Mark an expense as paid (by specific members or all)
const markExpensePaid = async (expenseId, memberId = null) => {
  try {
    const payload = memberId ? { memberId } : {}; // If null, mark as paid for all
    const response = await axios.put(`${API_URL}/${expenseId}/mark-paid`, payload, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error marking expense as paid:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch overall analytics for a group (who owes whom)
const getGroupAnalytics = async (groupId) => {
  try {
    const response = await axios.get(`${API_URL}/group/${groupId}/analytics`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error fetching analytics:", error.response?.data || error.message);
    throw error;
  }
};

const expenseService = {
  getExpenses,
  addExpense,
  markExpensePaid,
  getGroupAnalytics,
};

export default expenseService;
