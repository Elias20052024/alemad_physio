import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const getAllPatients = async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      include: { 
        user: true
      }
    });
    res.json(patients || []);
  } catch (error) {
    console.error('Error fetching patients:', error);
    // Return empty array instead of error
    res.json([]);
  }
};

export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true
      }
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient', error: error.message });
  }
};

export const createPatient = async (req, res) => {
  try {
    const { fullName, phone, gender = 'Other', age, medicalHistory, email, password } = req.body;

    // Validate all required fields
    if (!fullName || !phone) {
      return res.status(400).json({ message: 'Required fields missing: fullName, phone' });
    }

    // Validate name is not empty
    if (fullName.trim().length === 0) {
      return res.status(400).json({ message: 'Full name cannot be empty' });
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
      
      // Check if email already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already registered' });
      }
    }

    // Validate phone format - must be valid phone number (relaxed validation)
    const phoneRegex = /^[+]?[0-9\s().\-]{8,}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return res.status(400).json({ message: 'Invalid phone number format. Use format like: +966501234567 or (050) 123-4567' });
    }

    // Validate gender
    const validGenders = ['Male', 'Female', 'Other'];
    if (!validGenders.includes(gender)) {
      return res.status(400).json({ message: 'Gender must be Male, Female, or Other' });
    }

    // Hash password (use provided password or default)
    const hashedPassword = await bcrypt.hash(password || 'default-password', 10);

    // Create User first (required for Patient)
    const user = await prisma.user.create({
      data: {
        email: email || `patient-${Date.now()}@alemad-clinic.com`,
        password: hashedPassword,
        name: fullName.trim(),
        role: 'patient'
      }
    });

    // Create Patient linked to User
    const patient = await prisma.patient.create({
      data: { 
        phone: phone.trim(), 
        gender,
        age: age ? parseInt(age) : null,
        medicalHistory: medicalHistory ? medicalHistory.trim() : null,
        user: { connect: { id: user.id } }
      },
      include: { user: true }
    });

    res.status(201).json({ message: 'Patient created successfully', patient });
  } catch (error) {
    res.status(500).json({ message: 'Error creating patient', error: error.message });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, email, gender, age, medicalHistory, password, status } = req.body;

    // Get the patient with user info
    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(id) },
      include: { user: true }
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Validate phone if provided
    if (phone) {
      const phoneRegex = /^[0-9+\-\s()]+$/;
      if (!phoneRegex.test(phone) || phone.length < 7) {
        return res.status(400).json({ message: 'Invalid phone number format' });
      }
    }

    // Validate gender if provided
    if (gender) {
      const validGenders = ['Male', 'Female', 'Other'];
      if (!validGenders.includes(gender)) {
        return res.status(400).json({ message: 'Gender must be Male, Female, or Other' });
      }
    }

    // Update patient fields
    const updatedPatient = await prisma.patient.update({
      where: { id: parseInt(id) },
      data: {
        ...(phone && { phone: phone.trim() }),
        ...(gender && { gender }),
        ...(age && { age: parseInt(age) }),
        ...(medicalHistory !== undefined && { medicalHistory: medicalHistory ? medicalHistory.trim() : null }),
        ...(status && { status: status.trim() })
      },
      include: { user: true }
    });

    // Update user name if fullName is provided
    if (fullName) {
      await prisma.user.update({
        where: { id: patient.userId },
        data: { name: fullName.trim() }
      });
      updatedPatient.user.name = fullName.trim();
    }

    // Update email if provided
    if (email) {
      // Check if email already exists (and it's not the current user's email)
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser && existingUser.id !== patient.userId) {
        return res.status(409).json({ message: 'Email already registered' });
      }
      
      await prisma.user.update({
        where: { id: patient.userId },
        data: { email: email.trim() }
      });
      updatedPatient.user.email = email.trim();
    }

    // Update password if provided
    if (password && password.trim().length > 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await prisma.user.update({
        where: { id: patient.userId },
        data: { password: hashedPassword }
      });
      updatedPatient.user = updatedUser; // Replace with fresh user data from database
    }

    res.json({ message: 'Patient updated successfully', patient: updatedPatient });
  } catch (error) {
    res.status(500).json({ message: 'Error updating patient', error: error.message });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.patient.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Patient deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting patient', error: error.message });
  }
};

export const getPatientAppointments = async (req, res) => {
  try {
    const { id } = req.params;
    const appointments = await prisma.appointment.findMany({
      where: { patientId: parseInt(id) },
      include: { therapist: true },
      orderBy: { appointmentDate: 'desc' }
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

// ============================================
// PATIENT AUTHENTICATION
// ============================================

export const registerPatient = async (req, res) => {
  try {
    const { fullName, email, password, phone, age, gender } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !phone || !gender) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User first (required for Patient)
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        name: fullName.trim(),
        role: 'patient'
      }
    });

    // Create Patient linked to User
    const patient = await prisma.patient.create({
      data: {
        phone: phone.trim(),
        gender,
        medicalHistory: null,
        user: { connect: { id: user.id } }
      },
      include: { user: true }
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'patient' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Patient registered successfully',
      token,
      patient: {
        id: patient.id,
        fullName: user.name,
        email: user.email,
        phone: patient.phone,
        gender: patient.gender
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

export const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Find user with role='patient' and matching email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { patient: true }
    });

    if (!user || user.role !== 'patient') {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'patient' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      patient: {
        id: user.patient?.id,
        fullName: user.name,
        email: user.email,
        phone: user.patient?.phone,
        gender: user.patient?.gender
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
