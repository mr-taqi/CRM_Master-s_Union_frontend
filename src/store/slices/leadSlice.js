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

// Fetch leads
export const fetchLeads = createAsyncThunk(
  'leads/fetchLeads',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/leads`, {
        ...getAuthHeaders(),
        params
      })
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch leads'
      )
    }
  }
)

// Fetch single lead
export const fetchLead = createAsyncThunk(
  'leads/fetchLead',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/leads/${id}`, getAuthHeaders())
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch lead'
      )
    }
  }
)

// Create lead
export const createLead = createAsyncThunk(
  'leads/createLead',
  async (leadData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/leads`,
        leadData,
        getAuthHeaders()
      )
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create lead'
      )
    }
  }
)

// Update lead
export const updateLead = createAsyncThunk(
  'leads/updateLead',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/leads/${id}`,
        data,
        getAuthHeaders()
      )
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update lead'
      )
    }
  }
)

// Delete lead
export const deleteLead = createAsyncThunk(
  'leads/deleteLead',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/leads/${id}`, getAuthHeaders())
      return id
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete lead'
      )
    }
  }
)

const leadSlice = createSlice({
  name: 'leads',
  initialState: {
    leads: [],
    currentLead: null,
    total: 0,
    page: 1,
    pages: 1,
    loading: false,
    error: null
  },
  reducers: {
    clearCurrentLead: (state) => {
      state.currentLead = null
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false
        state.leads = action.payload.leads
        state.total = action.payload.total
        state.page = action.payload.page
        state.pages = action.payload.pages
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchLead.fulfilled, (state, action) => {
        state.currentLead = action.payload
      })
      .addCase(createLead.fulfilled, (state, action) => {
        state.leads.unshift(action.payload)
        state.total += 1
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        const index = state.leads.findIndex(
          (lead) => lead.id === action.payload.id
        )
        if (index !== -1) {
          state.leads[index] = action.payload
        }
        if (state.currentLead?.id === action.payload.id) {
          state.currentLead = action.payload
        }
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.leads = state.leads.filter((lead) => lead.id !== action.payload)
        state.total -= 1
      })
  }
})

export const { clearCurrentLead, clearError } = leadSlice.actions
export default leadSlice.reducer

