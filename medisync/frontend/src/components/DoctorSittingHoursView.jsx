import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const DoctorSittingHoursView = ({ doctorId }) => {
  const [sittingHours, setSittingHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (doctorId) {
      fetchDoctorSittingHours(doctorId);
    }
  }, [doctorId]);

  const fetchDoctorSittingHours = async (id) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`http://localhost:3000/doctor/${id}/sitting-hours`);
      
      // Sort days in correct order
      const daysOrder = {
        'Monday': 1,
        'Tuesday': 2,
        'Wednesday': 3,
        'Thursday': 4,
        'Friday': 5,
        'Saturday': 6,
        'Sunday': 7
      };
      
      const sortedHours = [...response.data].sort((a, b) => 
        daysOrder[a.day] - daysOrder[b.day]
      );
      
      setSittingHours(sortedHours);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching doctor sitting hours:', err);
      setError('Could not load doctor\'s sitting hours');
      setLoading(false);
    }
  };

  // Format time to 12-hour format
  const formatTime = (time) => {
    if (!time) return '';
    
    try {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      
      return `${formattedHour}:${minutes} ${ampm}`;
    } catch (e) {
      return time;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  if (!sittingHours || sittingHours.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 3 }}>
        No sitting hours information available for this doctor.
      </Alert>
    );
  }

  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
          <TimeIcon sx={{ mr: 1 }} /> Hospital Sitting Hours
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={1}>
          {sittingHours.map((hour, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                variant="outlined" 
                sx={{ 
                  p: 1.5, 
                  height: '100%',
                  bgcolor: hour.isAvailable ? 'background.paper' : 'grey.50',
                  borderColor: hour.isAvailable ? 'primary.light' : 'grey.300'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                    {hour.day}
                  </Typography>
                  <Chip 
                    size="small"
                    icon={hour.isAvailable ? <CheckIcon /> : <CloseIcon />}
                    label={hour.isAvailable ? "Available" : "Not Available"}
                    color={hour.isAvailable ? "success" : "default"}
                    variant={hour.isAvailable ? "filled" : "outlined"}
                  />
                </Box>
                
                {hour.isAvailable && (
                  <Typography variant="body2" color="text.secondary">
                    {formatTime(hour.startTime)} - {formatTime(hour.endTime)}
                  </Typography>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DoctorSittingHoursView;
