
const Contact = require('../models/Contact');
const Activity = require('../models/Activity');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Create transporter for sending emails only if environment variables are defined
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

// Submit a contact form
exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }
    
    console.log('Received contact form submission:', { name, email, phone, message });
    
    // Create new contact
    const contact = new Contact({
      name,
      email,
      phone,
      message
    });
    
    await contact.save();
    console.log('Contact saved to database with ID:', contact._id);
    
    // Log activity
    try {
      await Activity.create({
        type: 'message',
        action: 'Nouveau message',
        details: `De: ${name} (${email})`,
      });
      console.log('Activity logged for new message');
    } catch (activityError) {
      console.error('Error logging activity:', activityError);
    }
    
    // Send email notification if transporter is configured
    if (transporter) {
      try {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER, // Send to yourself
          subject: 'Nouveau message de contact - 3ansdz',
          html: `
            <h2>Nouveau message de contact</h2>
            <p><strong>Nom:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Téléphone:</strong> ${phone || 'Non fourni'}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            <hr>
            <p>Ce message a été envoyé depuis le formulaire de contact sur 3ansdz.com</p>
          `
        };
        
        await transporter.sendMail(mailOptions);
        console.log('Email notification sent successfully');
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Continue execution even if email fails
      }
    }
    
    res.status(201).json({ message: 'Message envoyé avec succès' });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ message: error.message || 'Error submitting contact form' });
  }
};

// Get all contacts
exports.getContacts = async (req, res) => {
  try {
    console.log('Getting all contacts, user:', req.user?.username);
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error getting contacts:', error);
    res.status(500).json({ message: 'Error retrieving contacts' });
  }
};

// Get a single contact
exports.getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json(contact);
  } catch (error) {
    console.error('Error getting contact:', error);
    res.status(500).json({ message: 'Error retrieving contact' });
  }
};

// Mark contact as responded
exports.markResponded = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { responded: true },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    // Log activity
    try {
      await Activity.create({
        type: 'message',
        action: 'Message marqué comme répondu',
        details: `Message de: ${contact.name}`,
        user: req.user?.username || 'admin'
      });
    } catch (activityError) {
      console.error('Error logging activity:', activityError);
    }
    
    res.status(200).json(contact);
  } catch (error) {
    console.error('Error marking contact as responded:', error);
    res.status(500).json({ message: 'Error updating contact' });
  }
};

// Delete a contact
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    // Log activity
    try {
      await Activity.create({
        type: 'message',
        action: 'Message supprimé',
        details: `Message de: ${contact.name}`,
        user: req.user?.username || 'admin'
      });
    } catch (activityError) {
      console.error('Error logging activity:', activityError);
    }
    
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Error deleting contact' });
  }
};
