import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

// Fetch activities for a lead
export const fetchLeadActivities = createAsyncThunk(
  'activities/fetchLeadActivities',
  async (leadId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/activities/lead/${leadId}`,
        getAuthHeaders()
      )
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch activities'
      )
    }
  }
)

// Create activity
export const createActivity = createAsyncThunk(
  'activities/createActivity',
  async (activityData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/activities`,
        activityData,
        getAuthHeaders()
      )
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create activity'
      )
    }
  }
)

// Update activity
export const updateActivity = createAsyncThunk(
  'activities/updateActivity',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/activities/${id}`,
        data,
        getAuthHeaders()
      )
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update activity'
      )
    }
  }
)

// Delete activity
export const deleteActivity = createAsyncThunk(
  'activities/deleteActivity',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/activities/${id}`, getAuthHeaders())
      return id
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete activity'
      )
    }
  }
)

const activitySlice = createSlice({
  name: 'activities',
  initialState: {
    activities: [],
    loading: false,
    error: null
  },
  reducers: {
    addActivity: (state, action) => {
      state.activities.unshift(action.payload)
    },
    clearActivities: (state) => {
      state.activities = []
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeadActivities.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLeadActivities.fulfilled, (state, action) => {
        state.loading = false
        state.activities = action.payload
      })
      .addCase(fetchLeadActivities.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        state.activities.unshift(action.payload)
      })
      .addCase(updateActivity.fulfilled, (state, action) => {
        const index = state.activities.findIndex(
          (activity) => activity.id === action.payload.id
        )
        if (index !== -1) {
          state.activities[index] = action.payload
        }
      })
      .addCase(deleteActivity.fulfilled, (state, action) => {
        state.activities = state.activities.filter(
          (activity) => activity.id !== action.payload
        )
      })
  }
})

export const { addActivity, clearActivities, clearError } = activitySlice.actions
export default activitySlice.reducer

