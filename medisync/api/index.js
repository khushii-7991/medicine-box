const express= require('express');
const mongoose= require ('mongoose');
const cors = require('cors');
const doctorRoutes = require('./routes/doctorRoute');
const patientRouter = require('./routes/patientRoute');
const prescriptionRouter = require('./routes/prescriptionRoute');
const scheduleRoutes = require('./routes/scheduleRoute');


const app = express();
app.use(cors());
app.use(express.json());

app.use('/doctor', doctorRoutes);
app.use('/patient', patientRouter);
app.use('/prescription', prescriptionRouter);
app.use('/api/schedule', scheduleRoutes);

mongoose.connect('mongodb://localhost:27017/medwise')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.listen(3000, () => console.log('Server running on http://localhost:3000'));