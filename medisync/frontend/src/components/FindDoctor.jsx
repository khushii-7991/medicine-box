import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, TextField, Button, CircularProgress, Alert, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PhoneIcon from '@mui/icons-material/Phone';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error in FindDoctor:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" color="error" gutterBottom>
                        Something went wrong.
                    </Typography>
                    <Button 
                        variant="contained" 
                        onClick={() => this.setState({ hasError: false })}
                        sx={{ mt: 2 }}
                    >
                        Try Again
                    </Button>
                </Box>
            );
        }

        return this.props.children;
    }
}

const FindDoctor = () => {
    const navigate = useNavigate();
    const [city, setCity] = useState('');
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedSpecialization, setSelectedSpecialization] = useState('');
    const [doctorCategories, setDoctorCategories] = useState([]);

    useEffect(() => {
        // Initialize doctor categories
        setDoctorCategories([
            // By Body System / Organ
            { id: 1, name: 'Cardiologist', description: 'Heart specialist', group: 'Body System' },
            { id: 2, name: 'Neurologist', description: 'Brain & Nervous System specialist', group: 'Body System' },
            { id: 3, name: 'Pulmonologist', description: 'Lungs & Respiratory specialist', group: 'Body System' },
            // Add more categories as needed from your list
        ]);
    }, []);

    const fetchHospitals = async () => {
        if (!city) {
            setError('Please enter a city name');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Simulated hospital data for testing
            const mockHospitals = [
                {
                    name: 'City Hospital',
                    formatted_address: city + ', India',
                    formatted_phone_number: '+91 1234567890',
                    rating: 4.5,
                    user_ratings_total: 120,
                    doctors: [
                        {
                            id: 1,
                            name: 'Dr. Rahul Sharma',
                            specialization: 'Cardiologist',
                            experience: 15,
                            qualifications: 'MBBS, MD, DM Cardiology',
                            languages: ['English', 'Hindi'],
                            availability: 'Mon-Fri, 10:00 AM - 5:00 PM',
                            fees: 1000,
                            about: 'Experienced cardiologist with expertise in interventional cardiology'
                        },
                        {
                            id: 2,
                            name: 'Dr. Priya Patel',
                            specialization: 'Neurologist',
                            experience: 12,
                            qualifications: 'MBBS, MD, DM Neurology',
                            languages: ['English', 'Hindi', 'Gujarati'],
                            availability: 'Mon-Sat, 9:00 AM - 4:00 PM',
                            fees: 1200,
                            about: 'Specializes in neurological disorders and stroke management'
                        }
                    ]
                },
                {
                    name: 'Apollo Hospital',
                    formatted_address: city + ', India',
                    formatted_phone_number: '+91 9876543210',
                    rating: 4.8,
                    user_ratings_total: 250,
                    doctors: [
                        {
                            id: 3,
                            name: 'Dr. Amit Kumar',
                            specialization: 'Pulmonologist',
                            experience: 10,
                            qualifications: 'MBBS, MD Pulmonary Medicine',
                            languages: ['English', 'Hindi', 'Bengali'],
                            availability: 'Tue-Sun, 11:00 AM - 6:00 PM',
                            fees: 800,
                            about: 'Expert in respiratory diseases and critical care'
                        }
                    ]
                }
            ];

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Filter doctors based on specialization if selected
            const filteredHospitals = mockHospitals.map(hospital => ({
                ...hospital,
                doctors: selectedSpecialization
                    ? hospital.doctors.filter(doctor => doctor.specialization === selectedSpecialization)
                    : hospital.doctors
            })).filter(hospital => hospital.doctors.length > 0);

            setHospitals(filteredHospitals);
        } catch (err) {
            setError('Failed to fetch hospitals. Please try again.');
            console.error('Error fetching hospitals:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHospitals();
    }, []);

    const FeatureCard = ({ icon: Icon, title, description, buttonText, onClick, color }) => (
        <Card sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: '0.3s',
            cursor: 'pointer',
            '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
            }
        }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                <Box sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    backgroundColor: `${color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                }}>
                    <Icon sx={{ fontSize: 30, color: color }} />
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {description}
                </Typography>
                <Button
                    variant="contained"
                    onClick={onClick}
                    sx={{
                        bgcolor: color,
                        '&:hover': { bgcolor: color },
                        textTransform: 'none',
                        borderRadius: '8px',
                        px: 3
                    }}
                >
                    {buttonText}
                </Button>
            </CardContent>
        </Card>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: 'column', minHeight: '90vh' }}>
            {/* Search Section */}
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Box sx={{ mb: 4, p: 4, bgcolor: 'white', borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <Typography variant="h4" gutterBottom>
                            Search Hospitals & Doctors
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
                            Find the best hospitals and doctors in your city. Enter your city name below to get started.
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Select Specialization"
                                    value={selectedSpecialization}
                                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'white'
                                        }
                                    }}
                                >
                                    <MenuItem value="">All Specializations</MenuItem>
                                    {doctorCategories.map((category) => (
                                        <MenuItem key={category.id} value={category.name}>
                                            {category.name} - {category.description}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    fullWidth
                                    label="Enter City Name"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'white'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={fetchHospitals}
                                    disabled={loading}
                                    sx={{
                                        height: '56px',
                                        bgcolor: '#1976d2',
                                        '&:hover': { bgcolor: '#1565c0' }
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>

                {/* Results Section */}
                {error && (
                    <Grid item xs={12}>
                        <Alert severity="error">{error}</Alert>
                    </Grid>
                )}

                {hospitals.map((hospital, index) => (
                    <Grid item xs={12} md={6} key={index}>
                        <Card sx={{
                            height: '100%',
                            transition: '0.3s',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                            }
                        }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Box sx={{ 
                                        width: 48, 
                                        height: 48, 
                                        borderRadius: '50%', 
                                        bgcolor: '#1976d215',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mr: 2
                                    }}>
                                        <LocalHospitalIcon sx={{ color: '#1976d2', fontSize: 28 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" sx={{ color: '#1976d2' }}>
                                            {hospital.name}
                                        </Typography>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            {hospital.doctors.length} Doctors Available
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <LocationOnIcon sx={{ color: '#666', mr: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {hospital.formatted_address}
                                    </Typography>
                                </Box>

                                {hospital.formatted_phone_number && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <PhoneIcon sx={{ color: '#666', mr: 1 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {hospital.formatted_phone_number}
                                        </Typography>
                                    </Box>
                                )}

                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    mt: 2,
                                    p: 1,
                                    bgcolor: '#f5f5f5',
                                    borderRadius: 1
                                }}>
                                    <StarIcon sx={{ color: '#ffc107', mr: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {hospital.rating} ({hospital.user_ratings_total} reviews)
                                    </Typography>
                                </Box>

                                {/* Doctor List */}
                                <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                                    Available Doctors
                                </Typography>
                                {hospital.doctors.map((doctor) => (
                                    <Box key={doctor.id} sx={{ 
                                        mt: 2, 
                                        p: 2, 
                                        border: '1px solid #e0e0e0',
                                        borderRadius: 2,
                                        '&:hover': { bgcolor: '#f5f5f5' }
                                    }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                    {doctor.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {doctor.specialization} • {doctor.experience} Years Experience
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="contained"
                                                onClick={() => navigate(`/book-appointment/${doctor.id}`)}
                                                sx={{ 
                                                    bgcolor: '#4caf50',
                                                    '&:hover': { bgcolor: '#43a047' },
                                                    textTransform: 'none',
                                                    borderRadius: '8px',
                                                }}
                                            >
                                                Book Now
                                            </Button>
                                        </Box>
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            {doctor.qualifications}
                                        </Typography>
                                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                ₹{doctor.fees} Consultation
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {doctor.availability}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            Languages: {doctor.languages.join(', ')}
                                        </Typography>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                {hospitals.length === 0 && !loading && !error && (
                    <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', p: 4 }}>
                            <Typography variant="h6" color="text.secondary">
                                No hospitals found in this city
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Try searching in a different city
                            </Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>
            <Box sx={{ mt: 'auto', pt: 4, pb: 2 }}>
                <Typography variant="body2" color="textSecondary" align="center">
                    &copy; 2025 MediSync | Smart Medical System. All rights reserved.
                </Typography>
            </Box>
        </Container>
    );
};

const WrappedFindDoctor = () => (
    <ErrorBoundary>
        <FindDoctor />
    </ErrorBoundary>
);

export default WrappedFindDoctor;
