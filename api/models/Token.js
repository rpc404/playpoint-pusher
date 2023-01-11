const mongoose = require('mongoose');
var ttl = require('mongoose-ttl');

// model with token that expires after 2 minutes
const tokenSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    token: { type: String, required: true },
  },
  { timestamps: true }
);
tokenSchema.plugin(ttl, { ttl: '2m' });
tokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 120 });
const Token = mongoose.model('token', tokenSchema);

module.exports = Token;