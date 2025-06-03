const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB (local instance) for pointmate (login/signup)
mongoose.connect('mongodb://localhost:27017/pointmate')
  .then(() => console.log('Connected to MongoDB (pointmate)'))
  .catch(err => console.error('MongoDB connection error:', err));

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});
const User = mongoose.model('User', UserSchema);

// Profile schema in pointmate database
const ProfileSchema = new mongoose.Schema({
  email_login: { type: String, unique: true, required: true }, // login email
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
  aictePoints: { type: Number, default: 0 }  // Add AICTE points field with default value
});
const Profile = mongoose.model('Profile', ProfileSchema);

// Event schema in pointmate database
const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  domain: { type: String, required: true },
  points: { type: Number, required: true },
  poster: {
    filename: String,
    path: String,
    mimetype: String
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: {
    address: { type: String, required: true },
    coordinates: {
      lat: Number,
      lng: Number
    },
    placeId: String
  },
  organizedBy: { type: String, required: true },
  org_email_login: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' }
});

// Explicitly set the collection name to 'events'
const Event = mongoose.model('Event', EventSchema, 'events');

// Organization schema in pointmate database
const OrganizationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  designation: { type: String, required: true },
  contactNumber: { type: String, required: true },
  organizationEmail: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Note: Storing passwords directly is not secure. Hashing is recommended.
  institutionName: { type: String, required: true },
  aicteApprovalNumber: { type: String, required: true, unique: true },
  authorizedPersonName: { type: String, required: true },
  registeredAt: { type: Date, default: Date.now }
});

const Organization = mongoose.model('Organization', OrganizationSchema, 'organizations');

// Add connection logging
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
  // List all collections
  mongoose.connection.db.listCollections().toArray((err, collections) => {
    if (err) {
      console.error('Error listing collections:', err);
    } else {
      console.log('Available collections:', collections.map(c => c.name));
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend server is running' });
});

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });
    user = new User({ name, email, password });
    await user.save();
    res.json({ 
      message: 'Signup successful', 
      name, 
      email,
      isAuthenticated: true 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User does not exist. Please sign up first.' });
    }
    if (user.password !== password) {
      return res.status(400).json({ message: 'Incorrect password.' });
    }
    res.json({ 
      message: 'Login successful', 
      ...user.toObject(),
      isAuthenticated: true 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile endpoint (only name and password allowed)
app.post('/api/update-profile', async (req, res) => {
  const { email, name, password } = req.body;
  const updates = {};
  if (name) updates.name = name;
  if (password) updates.password = password;
  try {
    const user = await User.findOneAndUpdate({ email }, updates, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student profile from pointmate database
app.get('/api/pointmate/profile/get', async (req, res) => {
  const { email_login } = req.query;
  try {
    const profile = await Profile.findOne({ email_login });
    if (profile) {
      res.json(profile);
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student profile in pointmate database
app.post('/api/pointmate/profile/update', async (req, res) => {
  const { email_login, ...profileFields } = req.body;
  try {
    // Ensure aictePoints is a number
    if (profileFields.aictePoints !== undefined) {
      profileFields.aictePoints = Number(profileFields.aictePoints);
    }

    const profile = await Profile.findOneAndUpdate(
      { email_login },
      { $set: profileFields },
      { new: true, upsert: true }
    );
    res.json({ message: 'Profile updated successfully', profile });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Migration endpoint to add aictePoints to existing profiles
app.post('/api/pointmate/migrate-aicte-points', async (req, res) => {
  try {
    const result = await Profile.updateMany(
      { aictePoints: { $exists: false } },  // Find documents where aictePoints doesn't exist
      { $set: { aictePoints: 0 } }          // Set aictePoints to 0
    );
    console.log('Migration result:', result);
    res.json({ 
      message: 'Migration completed successfully', 
      modifiedCount: result.modifiedCount 
    });
  } catch (err) {
    console.error('Migration error:', err);
    res.status(500).json({ message: 'Migration failed' });
  }
});

// Create new event with file upload
app.post('/api/pointmate/events/create', upload.single('poster'), async (req, res) => {
  try {
    console.log('Received event creation request body:', req.body);
    console.log('Received file:', req.file);
    
    const eventData = {
      ...req.body,
      poster: req.file ? {
        filename: req.file.filename,
        path: req.file.path,
        mimetype: req.file.mimetype
      } : null
    };
    
    console.log('Processed event data:', eventData);
    
    // Parse dates
    if (eventData.startDate) {
      eventData.startDate = new Date(eventData.startDate);
    }
    if (eventData.endDate) {
      eventData.endDate = new Date(eventData.endDate);
    }
    
    // Parse location if it's a string
    if (typeof eventData.location === 'string') {
      try {
        eventData.location = JSON.parse(eventData.location);
      } catch (e) {
        console.error('Error parsing location:', e);
        eventData.location = {
          address: eventData.location,
          coordinates: { lat: 0, lng: 0 },
          placeId: ''
        };
      }
    }
    
    console.log('Final event data before save:', eventData);
    
    const event = new Event(eventData);
    console.log('Created event document:', event);
    
    await event.save();
    console.log('Event saved successfully');
    
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (err) {
    console.error('Detailed event creation error:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ 
      message: 'Error creating event',
      error: err.message 
    });
  }
});

// Get all events
app.get('/api/pointmate/events', async (req, res) => {
  try {
    // Check if org_email query parameter exists
    const { org_email } = req.query;
    let filter = {};
    if (org_email) {
      filter.org_email_login = org_email;
      console.log('Fetching events filtered by org_email_login:', org_email); // Log filter
    } else {
      console.log('Fetching all events'); // Log fetching all
    }

    const events = await Event.find(filter).sort({ startDate: 1 }); // Apply the filter
    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// Get event by ID
app.get('/api/pointmate/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(500).json({ message: 'Error fetching event' });
  }
});

// Update event
app.put('/api/pointmate/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (event) {
      res.json({ message: 'Event updated successfully', event });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({ message: 'Error updating event' });
  }
});

// Delete event
app.delete('/api/pointmate/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (event) {
      res.json({ message: 'Event deleted successfully' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ message: 'Error deleting event' });
  }
});

// Organization registration endpoint
app.post('/api/pointmate/organizations/register', async (req, res) => {
  try {
    console.log('Received organization registration request:', req.body);
    const organizationData = req.body;

    // Check if organization already exists by email or AICTE number
    const existingOrg = await Organization.findOne({
      $or: [
        { organizationEmail: organizationData.organizationEmail },
        { aicteApprovalNumber: organizationData.aicteApprovalNumber }
      ]
    });

    if (existingOrg) {
      return res.status(400).json({ message: 'Organization with this email or AICTE Approval Number already exists.' });
    }

    // Note: Password confirmation is typically handled on the frontend for immediate feedback
    // You might want password hashing here before saving to production.

    const organization = new Organization(organizationData);
    await organization.save();
    console.log('Organization registered successfully:', organization);

    res.status(201).json({ message: 'Organization registered successfully!', organizationId: organization._id });
  } catch (err) {
    console.error('Organization registration error:', err);
    res.status(500).json({ message: 'Error registering organization', error: err.message });
  }
});

// Organization login endpoint
app.post('/api/pointmate/organizations/login', async (req, res) => {
  try {
    console.log('Received organization login request:', req.body);
    const { organizationEmail, institutionName, password } = req.body;

    // Find the organization by email and institution name
    const organization = await Organization.findOne({ organizationEmail, institutionName });

    if (!organization) {
      console.log('Organization not found for email:', organizationEmail);
      return res.status(404).json({ message: 'User does not exist. Please sign up first.' });
    }

    // Note: In a real application, compare hashed passwords securely
    if (organization.password !== password) {
      console.log('Incorrect password for organization:', organizationEmail);
      return res.status(401).json({ message: 'Incorrect password.' });
    }

    console.log('Organization logged in successfully:', organizationEmail);
    res.json({ 
      message: 'Login successful', 
      organization: organization.toObject(),
      isAuthenticated: true // You might use tokens/sessions in a real app
    });

  } catch (err) {
    console.error('Organization login error:', err);
    res.status(500).json({ message: 'Error during organization login', error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`)); 