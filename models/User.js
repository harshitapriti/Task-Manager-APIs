const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
      try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
      } catch (err) {
        next(err);
      }
    } else {
      next();
    }
  });

// Compare password
userSchema.methods.comparePassword = async function (password) {
    if (!password || !this.password) {
      throw new Error('Password or stored password is missing');
    }
    return bcrypt.compare(password, this.password);
  };
  

module.exports = mongoose.model('TMUser', userSchema);