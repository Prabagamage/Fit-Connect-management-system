import Gym from "../models/Gym.js";

// Create a Gym
export const createGym = async (req, res) => {
  try {
    const { location, services, fees, phone, email } = req.body;
    const name = req.body.gymName;
    // Extract filenames from req.files
    const fileNames = Object.values(req.files).flat().map(file => file.filename);
    console.log(services)
    const jsonServices = JSON.parse(services);
    const gym = new Gym({ name, location, services: jsonServices, fees, phone, email, images: fileNames.map(file => `/uploads/${file}`) });
    await gym.save();
    res.status(201).json(gym);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Gyms (with filters)
export const getGyms = async (req, res) => {
  try {
    const { location, services, minPrice, maxPrice } = req.query;
    let filters = {};
    if (location) filters.location = location;
    if (services) filters.services = { $in: services.split(",") };
    if (minPrice || maxPrice) {
      filters.pricing = { $gte: minPrice || 0, $lte: maxPrice || Infinity };
    }
    const gyms = await Gym.find(filters).populate("reviews");
    res.status(200).json(gyms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Gym by ID
export const getGymById = async (req, res) => {
  try {
    const gym = await Gym.findById(req.params.id).populate("reviews");
    if (!gym) return res.status(404).json({ message: "Gym not found!" });
    res.status(200).json(gym);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Gym
export const updateGym = async (req, res) => {
  try {
    const { location, services, fees, phone, email } = req.body;
    const name = req.body.gymName;
    
    // Parse services if it's a string
    const jsonServices = typeof services === 'string' ? JSON.parse(services) : services;

    // Handle file uploads - check if files exist first
    let imageUrls = [];
    if (req.files && req.files.photos) {
      imageUrls = req.files.photos.map(file => `/uploads/${file.filename}`);
    }

    const updateData = {
      name, 
      location, 
      services: jsonServices, 
      fees, 
      phone, 
      email
    };
    
    // Only add images field if new images were uploaded
    if (imageUrls.length > 0) {
      updateData.images = imageUrls;
    }

    const gym = await Gym.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!gym) return res.status(404).json({ message: "Gym not found!" });
    res.status(200).json(gym);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete Gym
export const deleteGym = async (req, res) => {
  try {
    const gym = await Gym.findByIdAndDelete(req.params.id);
    if (!gym) return res.status(404).json({ message: "Gym not found!" });
    res.status(200).json({ message: "Gym deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
