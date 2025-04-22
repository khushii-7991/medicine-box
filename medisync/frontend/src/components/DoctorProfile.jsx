import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    TextField,
    Avatar,
    Container,
    Paper,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    CardActionArea,
    CardMedia,
    CardActions,
    MenuItem
} from '@mui/material';
import {
    LocalHospital as HospitalIcon,
    School as SchoolIcon,
    Language as LanguageIcon,
    AccessTime as TimeIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Star as StarIcon,
    Money as MoneyIcon,
    Add as AddIcon,
    MedicalServices as MedicalIcon,
    CalendarMonth as CalendarIcon,
    People as PeopleIcon,
    Dashboard as DashboardIcon,
} from '@mui/icons-material';
import DoctorSittingHours from './DoctorSittingHours';

const defaultData = {
    name: '',
    specialization: '',
    hospital: '',
    qualifications: '',
    languages: '',
    availability: 'Mon-Sat, 10:00 AM - 7:00 PM',
    consultationFee: '500',
    rating: '4.8',
    totalPatients: '1000',
    avatar: 'https://via.placeholder.com/150'
};

const DoctorProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [doctorData, setDoctorData] = useState(null);
    const [editedData, setEditedData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedData = localStorage.getItem('doctorData');
        if (storedData) {
            const data = JSON.parse(storedData);
            setDoctorData(data);
            setEditedData(data);
        } else {
            setDoctorData(defaultData);
            setEditedData(defaultData);
        }
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedData(doctorData);
    };

    const handleSave = () => {
        setDoctorData(editedData);
        localStorage.setItem('doctorData', JSON.stringify(editedData));
        setIsEditing(false);
    };

    const handleChange = (field, value) => {
        setEditedData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (!doctorData) {
        return (
            <Container>
                <Typography variant="h6">Loading...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                            src={doctorData.avatar}
                            alt={doctorData.name}
                            sx={{ 
                                width: 120, 
                                height: 120, 
                                mr: 3,
                                border: '3px solid',
                                borderColor: 'primary.main'
                            }}
                        />
                        <Box>
                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                                {isEditing ? (
                                    <TextField
                                        value={editedData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        variant="standard"
                                        sx={{ mb: 1 }}
                                    />
                                ) : (
                                    doctorData.name
                                )}
                            </Typography>
                            <Typography variant="h6" color="primary" gutterBottom>
                                {isEditing ? (
                                    <TextField
                                        select
                                        value={editedData.specialization}
                                        onChange={(e) => handleChange('specialization', e.target.value)}
                                        variant="standard"
                                        sx={{ minWidth: 200 }}
                                    >
                                        <MenuItem value="Cardiologist">Cardiologist</MenuItem>
                                        <MenuItem value="Neurologist">Neurologist</MenuItem>
                                        <MenuItem value="Pulmonologist">Pulmonologist</MenuItem>
                                    </TextField>
                                ) : (
                                    doctorData.specialization
                                )}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <StarIcon sx={{ color: 'warning.main', mr: 0.5 }} />
                                    <Typography variant="body1">{doctorData.rating}/5</Typography>
                                </Box>
                                <Divider orientation="vertical" flexItem />
                                <Typography variant="body1">{doctorData.totalPatients}+ Patients</Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box>
                        {isEditing ? (
                            <Box>
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<SaveIcon />}
                                    onClick={handleSave}
                                    sx={{ mr: 1 }}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<CancelIcon />}
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        ) : (
                            <Button
                                variant="contained"
                                startIcon={<EditIcon />}
                                onClick={handleEdit}
                            >
                                Edit Profile
                            </Button>
                        )}
                    </Box>
                </Box>

                <Grid container spacing={3}>
                    {/* Professional Information */}
                    <Grid item xs={12} md={8}>
                        <Card elevation={2} sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
                                    Professional Information
                                </Typography>
                                <List>
                                    <ListItem>
                                        <ListItemIcon>
                                            <HospitalIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Hospital"
                                            secondary={
                                                isEditing ? (
                                                    <TextField
                                                        value={editedData.hospital}
                                                        onChange={(e) => handleChange('hospital', e.target.value)}
                                                        variant="standard"
                                                        fullWidth
                                                    />
                                                ) : doctorData.hospital
                                            }
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <SchoolIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Qualifications"
                                            secondary={
                                                isEditing ? (
                                                    <TextField
                                                        value={editedData.qualifications}
                                                        onChange={(e) => handleChange('qualifications', e.target.value)}
                                                        variant="standard"
                                                        fullWidth
                                                    />
                                                ) : doctorData.qualifications
                                            }
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <TimeIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Experience"
                                            secondary={
                                                isEditing ? (
                                                    <TextField
                                                        value={editedData.experience}
                                                        onChange={(e) => handleChange('experience', e.target.value)}
                                                        variant="standard"
                                                        fullWidth
                                                    />
                                                ) : doctorData.experience
                                            }
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <MoneyIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Consultation Fee"
                                            secondary={
                                                isEditing ? (
                                                    <TextField
                                                        value={editedData.consultationFee}
                                                        onChange={(e) => handleChange('consultationFee', e.target.value)}
                                                        variant="standard"
                                                        fullWidth
                                                    />
                                                ) : doctorData.consultationFee
                                            }
                                        />
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    {/* Additional Information */}
                    <Grid item xs={12} md={4}>
                        <Card elevation={2} sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
                                    Additional Information
                                </Typography>
                                <List>
                                    <ListItem>
                                        <ListItemIcon>
                                            <LanguageIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Languages"
                                            secondary={
                                                isEditing ? (
                                                    <TextField
                                                        value={doctorData.languages}
                                                        onChange={(e) => handleChange('languages', e.target.value)}
                                                        variant="standard"
                                                        fullWidth
                                                    />
                                                ) : doctorData.languages
                                            }
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <TimeIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Availability"
                                            secondary={
                                                isEditing ? (
                                                    <TextField
                                                        value={doctorData.availability}
                                                        onChange={(e) => handleChange('availability', e.target.value)}
                                                        variant="standard"
                                                        fullWidth
                                                    />
                                                ) : doctorData.availability
                                            }
                                        />
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Sitting Hours Section */}
                <Box sx={{ mt: 4 }}>
                    <DoctorSittingHours />
                </Box>

                {/* Main Features Section */}
                <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 6, mb: 3 }}>
                    Main Features
                </Typography>
                <Grid container spacing={3}>
                    {/* Add Hospital Card */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Card 
                            elevation={3} 
                            sx={{ 
                                height: '100%', 
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 12px 20px -10px rgba(0,105,255,0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(0,105,255,0.2)'
                                }
                            }}
                        >
                            <CardActionArea onClick={() => navigate('/add-hospital')} sx={{ height: '100%' }}>
                                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                                    <CardMedia
                                        component="div"
                                        sx={{
                                            height: 140,
                                            bgcolor: 'primary.main',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <HospitalIcon sx={{ fontSize: 80, color: 'white', opacity: 0.8 }} />
                                    </CardMedia>
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            bgcolor: 'primary.dark',
                                            color: 'white',
                                            p: 1,
                                            borderBottomLeftRadius: 8
                                        }}
                                    >
                                        <AddIcon />
                                    </Box>
                                </Box>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                        Add Hospital
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Register a new hospital in the system for doctors to select during registration.
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>

                    {/* Manage Appointments Card */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Card 
                            elevation={3} 
                            sx={{ 
                                height: '100%', 
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 12px 20px -10px rgba(76,175,80,0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(76,175,80,0.2)'
                                }
                            }}
                        >
                            <CardActionArea sx={{ height: '100%' }}>
                                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                                    <CardMedia
                                        component="div"
                                        sx={{
                                            height: 140,
                                            bgcolor: 'success.main',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <CalendarIcon sx={{ fontSize: 80, color: 'white', opacity: 0.8 }} />
                                    </CardMedia>
                                </Box>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                        Manage Appointments
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        View and manage your upcoming patient appointments.
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>

                    {/* Patient Records Card */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Card 
                            elevation={3} 
                            sx={{ 
                                height: '100%', 
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 12px 20px -10px rgba(255,152,0,0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(255,152,0,0.2)'
                                }
                            }}
                        >
                            <CardActionArea sx={{ height: '100%' }}>
                                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                                    <CardMedia
                                        component="div"
                                        sx={{
                                            height: 140,
                                            bgcolor: 'warning.main',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <PeopleIcon sx={{ fontSize: 80, color: 'white', opacity: 0.8 }} />
                                    </CardMedia>
                                </Box>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                        Patient Records
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Access and manage your patient medical records.
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>

                    {/* Medical Services Card */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Card 
                            elevation={3} 
                            sx={{ 
                                height: '100%', 
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 12px 20px -10px rgba(233,30,99,0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(233,30,99,0.2)'
                                }
                            }}
                        >
                            <CardActionArea sx={{ height: '100%' }}>
                                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                                    <CardMedia
                                        component="div"
                                        sx={{
                                            height: 140,
                                            bgcolor: 'error.main',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <MedicalIcon sx={{ fontSize: 80, color: 'white', opacity: 0.8 }} />
                                    </CardMedia>
                                </Box>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                        Medical Services
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Manage the medical services you offer to patients.
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default DoctorProfile;
