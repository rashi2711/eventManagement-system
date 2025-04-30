const mongoose = require('mongoose');

const subsectionSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Subsection name is required'], trim: true },
  section: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Section', 
    required: [true, 'Section is required'] 
  },
}, { timestamps: true });

module.exports = mongoose.model('Subsection', subsectionSchema);