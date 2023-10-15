const express = require("express");
const router = express.Router();
const EHR = require("../models/ehr");
const User = require("../models/user");

// {
//     "symptoms": ["Fever", "Cough"],
//     "drugs": "Paracetamol",
//     "disease": "Common Cold",
//     "formulations": ["Decoction A", "Syrup B"],
//     "sources": ["Ayurvedic Text X", "Research Paper Y"],
//     "dosage": ["Take 1 tablet every 4 hours"],
//     "ingredients": ["Ingredient A", "Ingredient B"],
//     "pharmacological_properties": ["Property X", "Property Y"],
//     "aleart_and_warnings": ["Warning 1", "Warning 2"],
//     "contradictions": ["Contradiction 1", "Contradiction 2"],
//     "meal_planning": ["Avoid spicy foods"],
//     "yoga_remcommandations": ["Practice yoga daily"]
//   }

router.post("/create", async (req, res) => {
  try {
    const { userId, symptoms } = req.body;
    if (!userId || !symptoms) {
      res.status(400).json({
        success: false,
        data: "User Id and symptoms are required",
      });
    } else {
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({
          success: false,
          data: "User not found",
        });
        return;
      } else {
        const ehrData = req.body;
        const createdEHR = await EHR.create(ehrData);

        user.PHR.push(createdEHR._id);
        await user.save();

        res.status(201).json({
          success: true,
          data: createdEHR,
        });
      }
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      error: "Server error " + error.message,
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    const allEHRs = await EHR.find();
    if (allEHRs.length > 0) {
      res.status(200).json({
        success: true,
        data: allEHRs,
      });
    } else {
      res.status(200).json({
        success: true,
        data: "NO EHR available in DB",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      error: "Server error " + error.message,
    });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId || req.user.userId;
    const ehr = await EHR.find({ userId });

    if (!ehr || ehr.length == 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "EHR record not found for the user.",
      });
    }

    res.status(200).json({
      success: true,
      data: ehr,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      data: [],
      error: "Something went wrong in getting the EHR record for the user.",
    });
  }
});

router.delete("/delete/:ehrId", async (req, res) => {
  try {
    const ehrId = req.params.ehrId;

    if (!ehrId) {
      return res.status(400).json({
        success: false,
        data: [],
        error: "EHR ID parameter is required.",
      });
    }

    const ehr = await EHR.findById(ehrId);

    if (!ehr) {
      return res.status(404).json({
        success: false,
        data: [],
        error: "EHR record not found.",
      });
    }

    const userId = ehr.userId; // Assuming you store userId in the EHR record
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        data: [],
        error: "User not found.",
      });
    }

    const index = user.PHR.indexOf(ehrId);
    if (index > -1) {
      user.PHR.splice(index, 1);
    }
    await user.save();

    await EHR.findByIdAndRemove(ehrId);

    res.status(200).json({
      success: true,
      data: "EHR record deleted successfully.",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      data: [],
      error: "Something went wrong while deleting the EHR record.",
    });
  }
});

router.put("/:ehrId", async (req, res) => {
  try {
    const ehrId = req.params.ehrId;

    if (!ehrId) {
      return res.status(400).json({
        success: false,
        data: [],
        error: "EHR ID parameter is required.",
      });
    }

    const ehr = await EHR.findById(ehrId);

    if (!ehr) {
      return res.status(404).json({
        success: false,
        data: [],
        error: "EHR record not found.",
      });
    }

    const updatedData = req.body;
    Object.assign(ehr, updatedData);
    await ehr.save();

    res.status(200).json({
      success: true,
      data: ehr,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      data: [],
      error: "Something went wrong while updating the EHR record.",
    });
  }
});

router.delete("/deleteByUser/:userId", async (req, res) => {
  try {
    const userId = req.params.userId || req.user.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        data: [],
        error: "User ID parameter is required.",
      });
    }

    const ehrRecords = await EHR.find({ userId });

    if (ehrRecords.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        error: "No EHR records found for the user.",
      });
    }

    for (const ehr of ehrRecords) {
      await ehr.deleteOne();
    }

    const user = await User.findById(userId);
    if (user) {
      user.PHR = [];
      await user.save();
    }

    res.status(200).json({
      success: true,
      data: "All EHR records deleted for the user.",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      data: [],
      error: "Something went wrong while deleting EHR records for the user.",
    });
  }
});

module.exports = router;
