const path = require("path");
const Bus = require("../models/busModel");

const createBus = async (req, res) => {
  const {
    busFrom,
    busTo,
    busDate,
    busName,
    busPrice,
    totalSeats,
    totalTime,
    busDescription,
  } = req.body;

  if (
    !busFrom ||
    !busTo ||
    !busDate ||
    !busName ||
    !busPrice ||
    !totalSeats ||
    !totalTime ||
    !busDescription
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required!" });
  }

  if (!req.files || !req.files.busImage) {
    return res
      .status(400)
      .json({ success: false, message: "Bus Image is required!" });
  }

  const busImage = req.files.busImage;
  const imageName = `${Date.now()}_${busImage.name}`;
  const imageUploadPath = path.join(
    __dirname,
    `../public/uploads/${imageName}`
  );

  try {
    await busImage.mv(imageUploadPath);

    const newBus = new Bus({
      busFrom,
      busTo,
      busDate,
      busName,
      busPrice,
      totalSeats,
      totalTime,
      busDescription,
      busImage: imageName,
    });

    const bus = await newBus.save();
    res.status(201).json({
      success: true,
      message: "Bus created successfully",
      data: bus,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

const getBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    res.status(200).json({ success: true, data: buses });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

module.exports = { createBus, getBuses };
