import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Divider,
  Switch,
  FormControlLabel,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';

const DoctorSittingHours = () => {
  const [sittingHours, setSittingHours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Fetch doctor's sitting hours when component mounts
  useEffect(() => {
    fetchSittingHours();
  }, []);

  const fetchSittingHours = async () => {
    try {
      setLoading(true);
      
      // Get token from localStorage
      const token = localStorage.getItem('doctorToken');
      if (!token) {
        toast.error('You must be logged in to view your sitting hours');
        setLoading(false);
        return;
      }

      // Get doctor ID from localStorage
      const doctorData = JSON.parse(localStorage.getItem('doctorData') || '{}');
      const doctorId = doctorData.id;
      
      if (!doctorId) {
        toast.error('Doctor ID not found');
        setLoading(false);
        return;
      }

      // Fetch sitting hours from backend
      const response = await axios.get(
        `http://localhost:3000/doctor/${doctorId}/sitting-hours`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // If no sitting hours are set yet, initialize with default values
      if (!response.data || response.data.length === 0) {
        const defaultHours = days.map(day => ({
          day,
          startTime: '09:00',
          endTime: '17:00',
          isAvailable: day !== 'Sunday'
        }));
        setSittingHours(defaultHours);
      } else {
        setSittingHours(response.data);
      }
      
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data?.message || 'Failed to fetch sitting hours');
      console.error('Error fetching sitting hours:', err);
      
      // Set default hours if fetch fails
      const defaultHours = days.map(day => ({
        day,
        startTime: '09:00',
        endTime: '17:00',
        isAvailable: day !== 'Sunday'
      }));
      setSittingHours(defaultHours);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Get token from localStorage
      const token = localStorage.getItem('doctorToken');
      if (!token) {
        toast.error('You must be logged in to update your sitting hours');
        setSaving(false);
        return;
      }

      // Update sitting hours
      const response = await axios.put(
        'http://localhost:3000/doctor/sitting-hours',
        { sittingHours },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setSaving(false);
      toast.success('Sitting hours updated successfully');
      
      // Update local state with response data
      setSittingHours(response.data);
    } catch (err) {
      setSaving(false);
      toast.error(err.response?.data?.message || 'Failed to update sitting hours');
      console.error('Error updating sitting hours:', err);
    }
  };

  const handleTimeChange = (index, field, value) => {
    const updatedHours = [...sittingHours];
    updatedHours[index][field] = value;
    setSittingHours(updatedHours);
  };

  const handleAvailabilityChange = (index, value) => {
    const updatedHours = [...sittingHours];
    updatedHours[index].isAvailable = value;
    setSittingHours(updatedHours);
  };

  return (
    <Card elevation={3} sx={{ mb: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            <TimeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Hospital Sitting Hours
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <CircularProgress size={24} color="inherit" /> : 'Save Hours'}
          </Button>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Set your regular hospital sitting hours. Patients will be able to see these timings when booking appointments.
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {sittingHours.map((hour, index) => (
              <Grid item xs={12} key={index}>
                <Card variant="outlined" sx={{ p: 2, bgcolor: hour.isAvailable ? 'white' : 'grey.100' }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                        {hour.day}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Start Time"
                        type="time"
                        value={hour.startTime}
                        onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ step: 300 }}
                        fullWidth
                        disabled={!hour.isAvailable}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="End Time"
                        type="time"
                        value={hour.endTime}
                        onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ step: 300 }}
                        fullWidth
                        disabled={!hour.isAvailable}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={hour.isAvailable}
                            onChange={(e) => handleAvailabilityChange(index, e.target.checked)}
                            color="primary"
                          />
                        }
                        label={hour.isAvailable ? "Available" : "Not Available"}
                      />
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default DoctorSittingHours;
