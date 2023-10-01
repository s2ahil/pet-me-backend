const mongoose=require( "mongoose");

// MongoDB Atlas URI with your username, password, and cluster name
const uri= "mongodb+srv://sahil:s2ahil@cluster0.nacyzus.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri,{dbName: "PetMe"})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Export the Mongoose connection
const db = mongoose.connection;

module.exports = db ;




//   const notificationSchema = new mongoose.Schema({
//     sender: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User', // Reference to either a Pet Owner or a Pet Renter
//     },
//     receiver: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User', // Reference to either a Pet Owner or a Pet Renter
//     },
//     message: String,
//     timestamp: {
//       type: Date,
//       default: Date.now,
//     },
//     viewed: Boolean,
//   });
  
//   const Notification = mongoose.model('Notification', notificationSchema);