const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { db } = require('./mongoose Connection/MongooseConnection')

const { PetOwner, PetRenter, BookingRequest } = require('./mongoose Connection/MongooseSchema');



const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const JWT_SECRET_KEY = 'keepersSecret';
const JWT_SECRET_KEY2 = 'OwnersSecret2';
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const token = req.header('Authorization');
    console.log('aya')

    if (!token) {
        return res.status(401).json({ error: 'Authentication failed: No token provided' });
    }

    jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Authentication failed: Invalid token' });
        }
        console.log('verified')
        req.user = user;
        next();
    });
}

function authenticateToken2(req, res, next) {
    const token = req.header('Authorization');
    console.log('aya')

    if (!token) {
        return res.status(401).json({ error: 'Authentication failed: No token provided' });
    }

    jwt.verify(token, JWT_SECRET_KEY2, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Authentication failed: Invalid token' });
        }
        console.log('verified')
        req.user = user;
        next();
    });
}









app.get('/', (req, res) => {
    res.send('Hello');
});

app.post('/loginKeeper', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if a user with the given email exists (you can modify this based on your schema)
        const user = await PetRenter.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify the password (you should use a more secure password hashing method)
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create a JWT token with user ID and return it
        const token = jwt.sign({ email: email }, JWT_SECRET_KEY);

        res.json({ token, userId: user._id });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post("/loginOwner", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the Pet Owner by email
        const petOwner = await PetOwner.findOne({ email });

        if (!petOwner) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify the password (you should use a more secure password hashing method)
        if (petOwner.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create a JWT token with Pet Owner's email and ID
        const token = jwt.sign({ email: petOwner.email }, JWT_SECRET_KEY2);

        res.json({ token, userId: petOwner._id });
    } catch (error) {
        console.error('Error during Pet Owner login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


app.post('/petOwner-register', async (req, res) => {
    console.log("enter owner ")
    try {
        const {
            location,
            mobileNo,
            petImage,
            duration,
            expectedRent,
            available,
            username,
            email,
            password,
            petDetails,
            imageOwner,
        } = req.body;

        // Create a new pet owner instance
        const newPetOwner = new PetOwner({
            location,
            mobileNo,
            petImage,
            duration,
            expectedRent,
            available,
            username,
            email,
            password,
            petDetails,
            imageOwner,
        });

        // Save the pet owner to the database
        await newPetOwner.save();

        res.status(201).json({ message: 'Pet owner registered successfully' });
    } catch (error) {
        console.error('Error registering pet owner:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/petRenter-register', async (req, res) => {

    console.log("enter renter ")
    try {
        const {
            location,
            name,
            mobileNumber,
            image,
            renterInfo,
            available,
            username,
            email,
            password,
        } = req.body;

        // Create a new pet renter instance
        const newPetRenter = new PetRenter({
            location,
            name,
            mobileNumber,
            image,
            renterInfo,
            available,
            username,
            email,
            password,
        });

        // Save the pet renter to the database
        await newPetRenter.save();

        res.status(201).json({ message: 'Pet renter registered successfully' });
    } catch (error) {
        console.error('Error registering pet renter:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get("/petOwner-details", authenticateToken, async (req, res) => {
    try {
        // Retrieve pet owner details from the database
        const petOwners = await PetOwner.find();

        // Send the pet owner details as a JSON response
        res.json(petOwners);
    } catch (error) {
        // Handle any errors
        res.status(500).json({ error: 'An error occurred while fetching pet owner details.' });
    }
})

app.get("/petRental-details", authenticateToken2, async (req, res) => {

    console.log("aya rental")
    try {
        // Fetch all pet renters from the database
        const allPetRenters = await PetRenter.find();

        // Send the pet renter details as a JSON response
        res.json(allPetRenters);
    } catch (error) {
        // Handle any errors that occur during the request
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

// Create Booking Request
app.post('/booking-request', async (req, res) => {
    console.log("booking req", req.body)
    try {
        const { petOwnerId, petRenterId } = req.body;
        console.log(req.body)

        // Create a new booking request instance with 'pending' status
        const newBookingRequest = new BookingRequest({
            petOwner: petOwnerId,
            petRenter: petRenterId,
            status: 'pending',
        });

        // Save the booking request to the database
        await newBookingRequest.save();

        res.status(201).json({ message: 'Booking request sent successfully' });
    } catch (error) {
        console.error('Error creating booking request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//main end point
//main end point
app.get('/booking-requests', authenticateToken2, async (req, res) => {
    console.log("aya booking")
    try {

        const userId = req.header("petOwnerId"); // Get the logged-in user's ID
        console.log(userId)
        // Find all booking requests sent to the logged-in user (pet owner) and populate the petRenter field to access renter data
        const bookingRequests = await BookingRequest.find({ petOwner: userId })
            .populate('petRenter'); // Populate the petRenter field with 'name' and 'email' fields

        // You can customize the response to include more details
        console.log(bookingRequests)
        res.json(bookingRequests);
    } catch (error) {
        console.error('Error retrieving booking requests:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/booking-requests-see-keeper', authenticateToken, async (req, res) => {
    console.log("aya booking keeper")
    try {

        const userId = req.header("petKeeperId"); // Get the logged-in user's ID
        console.log(userId)
        // Find all booking requests sent to the logged-in user (pet owner) and populate the petRenter field to access renter data
        const bookingRequests = await BookingRequest.find({ petRenter: userId })
            .populate('petOwner'); // Populate the petRenter field with 'name' and 'email' fields

        // You can customize the response to include more details
        console.log(bookingRequests)
        res.json(bookingRequests);
    } catch (error) {
        console.error('Error retrieving booking requests:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Retrieve Booking Requests for a User
app.get('/booking-requests/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find all booking requests involving the user
        const bookingRequests = await BookingRequest.find({
            $or: [{ petOwner: userId }, { petRenter: userId }],
        });

        res.json(bookingRequests);
    } catch (error) {
        console.error('Error retrieving booking requests:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Accept or Reject Booking Request
app.put('/booking-request/:requestId', authenticateToken2,async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const { status } = req.body;

        // Find the booking request by ID
        const bookingRequest = await BookingRequest.findById(requestId);

        if (!bookingRequest) {
            return res.status(404).json({ error: 'Booking request not found' });
        }

        // Update the status of the booking request
        bookingRequest.status = status;
        await bookingRequest.save();

        res.json({ message: 'Booking request updated successfully' });
    } catch (error) {
        console.error('Error updating booking request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Retrieve Booking Details
app.get('/booking-details/:requestId', async (req, res) => {

    try {
        const requestId = req.params.requestId;

        // Find the booking request by ID
        const bookingRequest = await BookingRequest.findById(requestId);

        if (!bookingRequest) {
            return res.status(404).json({ error: 'Booking request not found' });
        }

        // You can customize the response to include more details
        res.json(bookingRequest);
    } catch (error) {
        console.error('Error retrieving booking details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
