const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/pointmate')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Profile schema
const ProfileSchema = new mongoose.Schema({
  email_login: { type: String, unique: true, required: true },
  name: String,
  email: String,
  college: String,
  studentId: String,
  year: String,
  branch: String,
  semester: String,
  graduationYear: String,
  address: String,
  phone: String,
  aictePoints: { type: Number, default: 0 }
});

const Profile = mongoose.model('Profile', ProfileSchema);

// Update all profiles
async function updateProfiles() {
  try {
    const result = await Profile.updateMany(
      { aictePoints: { $exists: false } },
      { $set: { aictePoints: 0 } }
    );
    console.log('Update result:', result);
    console.log(`Updated ${result.modifiedCount} profiles`);
  } catch (err) {
    console.error('Error updating profiles:', err);
  } finally {
    mongoose.connection.close();
  }
}

// Run the update
updateProfiles(); 