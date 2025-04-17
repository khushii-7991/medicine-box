const Schedule = require('../models/scheduleModel');

const createSchedule = async (patientId, medicines) => {
    const today = new Date();
    const scheduleEntries = [];

    for (let i = 0; i < duration; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const medicineList = medicines.map(med => {
            const timingDates = med.timings.map(t => {
                const [time, modifier] = t.split(' ');
                let [hours, minutes] = time.split(':').map(Number);

                if (modifier === 'PM' && hours !== 12) hours += 12;
                if (modifier === 'AM' && hours === 12) hours = 0;

                const timingDate = new Date(date);
                timingDate.setHours(hours, minutes, 0, 0);
                return timingDate;
            });

            return {
                name: med.name,
                dosage: med.dosage,
                timings: timingDates,
                status: "pending"
            };
        });

        scheduleEntries.push({
            medicines: medicineList
        });
    }

    const finalSchedule = new Schedule({
        patientId,
        duration,
        schedule: scheduleEntries
    });

    await finalSchedule.save();
};



// Fetch schedule by prescription
const getSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const schedule = await Schedule.find({ prescriptionId: id }).sort('date');
        res.json(schedule);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch schedule' });
    }
};


// Update status for a specific day
const updateStatus = async (req, res) => {
    const { prescriptionId, date, status } = req.body;

    try {
        const updated = await Schedule.findOneAndUpdate(
            { prescriptionId, date: new Date(date) },
            { status },
            { new: true }
        );

        res.json({ message: "Updated successfully", updated });
    } catch (err) {
        res.status(500).json({ message: 'Update failed' });
    }
};
module.exports = {
    createSchedule,
   getSchedule,
    updateStatus
};
