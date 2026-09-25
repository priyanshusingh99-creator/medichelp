const mongoose = require('mongoose');

const drugInteractionSchema = new mongoose.Schema({
  drugA: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  drugB: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  interactionLevel: {
    type: String,
    required: true,
    enum: ['Safe', 'Moderate Risk', 'Severe Danger'],
    default: 'Safe'
  },
  adverseEffects: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index combination
drugInteractionSchema.index({ drugA: 1, drugB: 1 });

module.exports = mongoose.model('DrugInteraction', drugInteractionSchema);
