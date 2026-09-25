const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Disease name is required'],
    trim: true,
    index: true
  },
  bodyRegion: {
    type: String,
    required: true,
    enum: ['Head', 'Chest', 'Abdomen', 'Limbs', 'General'],
    index: true
  },
  severity: {
    type: String,
    required: true,
    enum: ['Mild', 'Moderate', 'Critical'],
    default: 'Moderate'
  },
  symptoms: [{
    type: String,
    trim: true
  }],
  longTermEffects: [{
    type: String
  }],
  temporarySolutions: [{
    type: String
  }],
  permanentSolutions: [{
    type: String
  }],
  dietaryRecommendations: {
    foodsToEat: [{ type: String }],
    foodsToAvoid: [{ type: String }]
  },
  doctorQuestions: [{
    type: String
  }]
}, {
  timestamps: true
});

// Create text index for search across name and symptoms
diseaseSchema.index({ name: 'text', symptoms: 'text' });

module.exports = mongoose.model('Disease', diseaseSchema);
