
const Visitor = require('../models/Visitor');
const nodemailer = require('nodemailer');

// Créer un transporter pour l'envoi d'emails uniquement si les variables d'environnement sont définies
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

// Record a new visitor
exports.recordVisit = async (req, res) => {
  try {
    const { page } = req.body;
    
    if (!page) {
      return res.status(400).json({ message: 'Page is required' });
    }
    
    const visitor = new Visitor({
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      page
    });
    
    await visitor.save();
    
    // Send email notification for important pages if transporter is configured
    if (transporter && (page === '/contact' || page === '/vehicules' || page.startsWith('/vehicules/'))) {
      try {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: `Nouvelle visite sur ${page} - 3ansdz`,
          html: `
            <h2>Nouvelle visite sur le site</h2>
            <p><strong>Page:</strong> ${page}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>IP:</strong> ${req.ip}</p>
            <p><strong>User Agent:</strong> ${req.headers['user-agent']}</p>
            <hr>
            <p>Cette notification a été envoyée automatiquement depuis 3ansdz.com</p>
          `
        };
        
        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Continue execution even if email fails
      }
    }
    
    res.status(201).json({ message: 'Visit recorded' });
  } catch (error) {
    // Don't return error to client, just log it
    console.error('Error recording visit:', error);
    res.status(200).json({ message: 'OK' });
  }
};

// Get visitor statistics
exports.getVisitorStats = async (req, res) => {
  try {
    // Get total visitors
    const totalVisitors = await Visitor.countDocuments();
    
    // Get visitors in the last 24 hours
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);
    const visitorsLast24Hours = await Visitor.countDocuments({
      timestamp: { $gte: last24Hours }
    });
    
    // Get visitors in the last 7 days
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const visitorsLast7Days = await Visitor.countDocuments({
      timestamp: { $gte: last7Days }
    });
    
    // Get most visited pages
    const mostVisitedPages = await Visitor.aggregate([
      { $group: { _id: '$page', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.status(200).json({
      totalVisitors,
      visitorsLast24Hours,
      visitorsLast7Days,
      mostVisitedPages
    });
  } catch (error) {
    console.error('Error getting visitor stats:', error);
    res.status(500).json({ message: 'Error retrieving visitor statistics' });
  }
};
