import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import groupService from "../services/groupService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Fetch all user groups
export const fetchGroups = createAsyncThunk("groups/fetchGroups", async (_, { rejectWithValue }) => {
  try {
    const response = await groupService.getGroups();
    return response.map(group => ({
      ...group,
      id: group._id, // Normalize _id to id
      members: group.members || [],
    }));
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch groups");
  }
});

// Create a new group
export const createGroup = createAsyncThunk("groups/createGroup", async (groupData, { rejectWithValue }) => {
  try {
    const response = await groupService.createGroup(groupData);
    toast.success("Group created successfully!");
    return { ...response, id: response._id, members: response.members || [] }; // Normalize
  } catch (error) {
    toast.error("Failed to create group.");
    return rejectWithValue(error.response?.data);
  }
});

// Add a member to a group
export const addMember = createAsyncThunk("groups/addMember", async ({ groupId, email }, { rejectWithValue }) => {
  try {
    const response = await groupService.addMember(groupId, email);
    toast.success("Member added!");
    return { groupId, member: { ...response, id: response._id } }; // Normalize member id
  } catch (error) {
    toast.error("Failed to add member.");
    return rejectWithValue(error.response?.data);
  }
});

// Remove a member
export const removeMember = createAsyncThunk("groups/removeMember", async ({ groupId, memberId }, { rejectWithValue }) => {
  try {
    await groupService.removeMember(groupId, memberId);
    toast.warn("Member removed!");
    return { groupId, memberId };
  } catch (error) {
    toast.error("Failed to remove member.");
    return rejectWithValue(error.response?.data);
  }
});

// Pin/Unpin a group
export const pinGroup = createAsyncThunk("groups/pinGroup", async (groupId, { rejectWithValue }) => {
  try {
    const response = await groupService.pinGroup(groupId); // Use groupService
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Error pinning group");
  }
});


// Delete a group
export const deleteGroup = createAsyncThunk("groups/deleteGroup", async (groupId) => {
  try {
    await groupService.deleteGroup(groupId);
  toast.error("Group deleted!");
  return groupId;
  } catch (error) {
    console.log(error);
    toast.error(error.response?.data.message|| "Error Deleting group" );
  }
});

const groupSlice = createSlice({
  name: "groups",
  initialState: {
    groups: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => { state.loading = true; })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.groups.push(action.payload);
      })
      .addCase(addMember.fulfilled, (state, action) => {
        const group = state.groups.find(g => g.id === action.payload.groupId);
        if (group) group.members.push(action.payload.member);
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        const group = state.groups.find(g => g.id === action.payload.groupId);
        if (group) {
          group.members = group.members.filter(m => m.id !== action.payload.memberId);
        }
      })
      .addCase(pinGroup.fulfilled, (state, action) => {
        const updatedGroup = { ...action.payload, id: action.payload._id }; // Ensure `id` is set
        const index = state.groups.findIndex((g) => g.id === updatedGroup.id);
        if (index !== -1) {
          state.groups[index].isPinned = updatedGroup.isPinned;
          state.groups.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
        }
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.groups = state.groups.filter(g => g.id !== action.payload);
      });
  },
});

export default groupSlice.reducer;
