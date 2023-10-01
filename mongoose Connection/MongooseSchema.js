const mongoose = require('mongoose');


const petOwnerSchema = new mongoose.Schema({
    location: String,
    mobileNo: String,
    petImage: String, // URL to the pet's image
    duration: String, // Rental duration options (e.g., hourly, daily, weekly)
    expectedRent: String,
    available: Boolean,
    username: String,
    email: String,
    password: String,
    petDetails: String, // Additional details about the pet
    imageOwner: String, // URL to the owner's image
  });
  
  const PetOwner = mongoose.model('PetOwner', petOwnerSchema);
  


  const petRenterSchema = new mongoose.Schema({
    location: String,
    mobileNumber: String,
    image: String, // URL to the renter's image
    renterInfo:String,
    available: Boolean,
    username: String,
    email: String,
    password: String,
  });
  
  const PetRenter = mongoose.model('PetRenter', petRenterSchema);
  
  
  const bookingRequestSchema = new mongoose.Schema({
    petOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PetOwner',
    },
    petRenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PetRenter',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    // Add more fields related to the booking request
  });
  
  const BookingRequest = mongoose.model('BookingRequest', bookingRequestSchema);
  


  
module.exports = {
    PetOwner,
    PetRenter,
    BookingRequest 
};