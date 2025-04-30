const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Section name is required'], trim: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Section', sectionSchema);