import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import expenseService from "../services/expenseService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Fetch expenses for a group
export const fetchExpenses = createAsyncThunk("expenses/fetchExpenses", async (groupId, { rejectWithValue }) => {
  try {
    const response = await expenseService.getExpenses(groupId);
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch expenses");
  }
});

// Add a new expense
export const createExpense = createAsyncThunk("expenses/createExpense", async (expenseData, { rejectWithValue }) => {
  try {
    const response = await expenseService.addExpense(expenseData);
    toast.success("Expense added successfully!");
    return response;
  } catch (error) {
    toast.error("Failed to add expense.");
    return rejectWithValue(error.response?.data);
  }
});

// Mark an expense as paid
export const markExpensePaid = createAsyncThunk("expenses/markExpensePaid", async ({ expenseId, memberId }, { rejectWithValue }) => {
  try {
    await expenseService.markExpensePaid(expenseId, memberId);
    toast.success("Expense marked as paid!");
    return { expenseId, memberId };
  } catch (error) {
    toast.error("Failed to mark expense as paid.");
    return rejectWithValue(error.response?.data);
  }
});

// Fetch group analytics
export const fetchGroupAnalytics = createAsyncThunk("expenses/fetchGroupAnalytics", async (groupId, { rejectWithValue }) => {
  try {
    const response = await expenseService.getGroupAnalytics(groupId);
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch analytics");
  }
});

const expenseSlice = createSlice({
  name: "expenses",
  initialState: {
    expenses: [],
    analytics: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => { state.loading = true; })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.expenses.push(action.payload);
      })
      .addCase(markExpensePaid.fulfilled, (state, action) => {
        const { expenseId, memberId } = action.payload;
        const expense = state.expenses.find(exp => exp.id === expenseId);
        if (expense) {
          if (memberId) {
            expense.paidMembers.push(memberId);
          } else {
            expense.paidMembers = expense.members.map(m => m.id);
          }
        }
      })
      .addCase(fetchGroupAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
      });
  },
});

export default expenseSlice.reducer;
