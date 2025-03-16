import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./authSlice";
import groupReducer from "./groupSlice";
import expenseReducer from "./expenseSlice"; // Import expenseSlice

const store = configureStore({
  reducer: {
    // auth: authReducer,
    groups: groupReducer,
    expenses: expenseReducer,
    
  },
});

export default store;
