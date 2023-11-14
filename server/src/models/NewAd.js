const mongoose = require('mongoose');

const newAdSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 1000,
  },
  requiredSkills: [String],
  postingDate: {
    type: Date,
    default: Date.now,
  },
  expirationDate: {
    type: Date,
  },
  creator: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Professional',
      required: true,
    },
  ],
  contractType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Freelance', 'Other'],
    required: true,
  },
  workLocation: {
    type: String,
    enum: ['Presencial', 'Remoto'],
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('NewAd', newAdSchema);
