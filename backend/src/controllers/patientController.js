import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const getAllPatients = async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      include: { appointments: true }
    });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients', error: error.message });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(id) },
      include: {
        appointments: {
          include: { therapist: true },
          orderBy: { date: 'desc' }
        }
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
    const { fullName, phone, age, gender, medicalHistory } = req.body;

    // Validate all required fields
    if (!fullName || !phone || !age || !gender) {
      return res.status(400).json({ message: 'All required fields missing: fullName, phone, age, gender' });
    }

    // Validate name is not empty
    if (fullName.trim().length === 0) {
      return res.status(400).json({ message: 'Full name cannot be empty' });
    }

    // Validate phone format
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(phone) || phone.length < 7) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    // Validate age is a positive number within reasonable range
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
      return res.status(400).json({ message: 'Age must be a valid number between 0 and 150' });
    }

    // Validate gender
    const validGenders = ['Male', 'Female', 'Other'];
    if (!validGenders.includes(gender)) {
      return res.status(400).json({ message: 'Gender must be Male, Female, or Other' });
    }

    const patient = await prisma.patient.create({
      data: { 
        fullName: fullName.trim(), 
        phone: phone.trim(), 
        age: ageNum, 
        gender, 
        medicalHistory: medicalHistory ? medicalHistory.trim() : null 
      }
    });

    res.status(201).json({ message: 'Patient created successfully', patient });
  } catch (error) {
    res.status(500).json({ message: 'Error creating patient', error: error.message });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, age, gender, medicalHistory } = req.body;

    // Validate phone if provided
    if (phone) {
      const phoneRegex = /^[0-9+\-\s()]+$/;
      if (!phoneRegex.test(phone) || phone.length < 7) {
        return res.status(400).json({ message: 'Invalid phone number format' });
      }
    }

    // Validate age if provided
    if (age !== undefined) {
      const ageNum = parseInt(age);
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
        return res.status(400).json({ message: 'Age must be a valid number between 0 and 150' });
      }
    }

    // Validate gender if provided
    if (gender) {
      const validGenders = ['Male', 'Female', 'Other'];
      if (!validGenders.includes(gender)) {
        return res.status(400).json({ message: 'Gender must be Male, Female, or Other' });
      }
    }

    const patient = await prisma.patient.update({
      where: { id: parseInt(id) },
      data: {
        ...(fullName && { fullName: fullName.trim() }),
        ...(phone && { phone: phone.trim() }),
        ...(age !== undefined && { age: parseInt(age) }),
        ...(gender && { gender }),
        ...(medicalHistory !== undefined && { medicalHistory: medicalHistory ? medicalHistory.trim() : null })
      }
    });

    res.json({ message: 'Patient updated successfully', patient });
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
      orderBy: { date: 'desc' }
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
    if (!fullName || !email || !password || !phone || !age || !gender) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if patient already exists
    const existingPatient = await prisma.patient.findUnique({
      where: { email }
    });

    if (existingPatient) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create patient
    const patient = await prisma.patient.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        phone,
        age: parseInt(age),
        gender
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: patient.id, email: patient.email, role: 'patient' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Patient registered successfully',
      token,
      patient: {
        id: patient.id,
        fullName: patient.fullName,
        email: patient.email,
        phone: patient.phone,
        age: patient.age,
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

    // Find patient
    const patient = await prisma.patient.findUnique({
      where: { email }
    });

    if (!patient) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, patient.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: patient.id, email: patient.email, role: 'patient' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      patient: {
        id: patient.id,
        fullName: patient.fullName,
        email: patient.email,
        phone: patient.phone,
        age: patient.age,
        gender: patient.gender
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
