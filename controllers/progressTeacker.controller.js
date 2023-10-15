// Create a new Progress Tracker record
const EHR = require("../models/ehr");
const ProgressTracker = require("../models/progressTreacker");
const User = require("../models/user");
const router = require("express").Router();

router.post("/create", async (req, res) => {
  try {
    const { userId, EHR_ID, Disease, progressRate, progressComment } = req.body;

    if (!userId || !EHR_ID || !Disease) {
      return res.status(400).json({
        success: false,
        data: [],
        error: "User ID, EHR ID, and Disease are required fields.",
      });
    }

    // Use the create function to create and save the progress tracker record
    const progressTracker = await ProgressTracker.create({
      userId,
      EHR_ID,
      Disease,
      progressRate,
      progressComment,
    });

    // Update the user's progress_records array
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        data: [],
        error: "User not found.",
      });
    }
    user.progress_records.push(progressTracker._id);
    await user.save();

    // Update the EHR's progress_records array
    const ehr = await EHR.findById(EHR_ID);
    if (!ehr) {
      return res.status(404).json({
        success: false,
        data: [],
        error: "EHR not found.",
      });
    }
    ehr.progress_records.push(progressTracker._id);
    await ehr.save();

    res.status(201).json({
      success: true,
      data: progressTracker,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      data: [],
      error: "Server error " + error.message,
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    const allProgressRecords = await ProgressTracker.find();

    if (allProgressRecords.length > 0) {
      res.status(200).json({
        success: true,
        data: allProgressRecords,
      });
    } else {
      res.status(200).json({
        success: true,
        data: "No records found",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      data: [],
      error: "Server error " + error.message,
    });
  }
});

router.get("/byUser/:userId", async (req, res) => {
  try {
    const userId = req.params.userId || req.user.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        data: [],
        error: "User ID parameter is required.",
      });
    }

    // Find progress tracker records that belong to the specified user
    const progressRecords = await ProgressTracker.find({ userId });

    if (progressRecords.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        error: "No progress tracker records found for the user.",
      });
    }

    res.status(200).json({
      success: true,
      data: progressRecords,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      data: [],
      error: "Something went wrong while fetching progress tracker records.",
    });
  }
});

router.get("/byEHR/:ehrId", async (req, res) => {
  try {
    const ehrId = req.params.ehrId;

    if (!ehrId) {
      return res.status(400).json({
        success: false,
        data: [],
        error: "EHR ID parameter is required.",
      });
    }
    const progressRecords = await ProgressTracker.find({ EHR_ID: ehrId });

    if (progressRecords.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        error: "No progress tracker records found for the EHR.",
      });
    } else {
      res.status(200).json({
        success: true,
        data: progressRecords,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      data: [],
      error: "Something went wrong while fetching progress tracker records.",
    });
  }
});

router.put("/:progressId", async (req, res) => {
  try {
    const progressId = req.params.progressId;

    if (!progressId) {
      return res.status(400).json({
        success: false,
        data: [],
        error: "Progress Tracker ID parameter is required.",
      });
    }

    // Find the progress tracker record by its ID
    const progressTracker = await ProgressTracker.findById(progressId);

    if (!progressTracker) {
      return res.status(404).json({
        success: false,
        data: [],
        error: "Progress Tracker record not found.",
      });
    }

    // Update the progress tracker record with the request data
    const updatedData = req.body;
    Object.assign(progressTracker, updatedData);

    // Save the updated progress tracker record
    await progressTracker.save();

    res.status(200).json({
      success: true,
      data: progressTracker,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      data: [],
      error: "Something went wrong while updating the Progress Tracker record.",
    });
  }
});

router.delete("/:progressId", async (req, res) => {
  try {
    const progressId = req.params.progressId;

    if (!progressId) {
      return res.status(400).json({
        success: false,
        data: [],
        error: "Progress Tracker ID parameter is required.",
      });
    }

    // Find the progress tracker record by its ID
    const progressTracker = await ProgressTracker.findById(progressId);

    if (!progressTracker) {
      return res.status(404).json({
        success: false,
        data: [],
        error: "Progress Tracker record not found.",
      });
    }

    // Remove the progress ID from the user's progress_records array
    const user = await User.findById(progressTracker.userId);
    if (user) {
      const index = user.progress_records.indexOf(progressId);
      if (index > -1) {
        user.progress_records.splice(index, 1);
        await user.save();
      }
    }

    // Remove the progress ID from the EHR's progress_records array
    const ehr = await EHR.findById(progressTracker.EHR_ID);
    if (ehr) {
      const index = ehr.progress_records.indexOf(progressId);
      if (index > -1) {
        ehr.progress_records.splice(index, 1);
        await ehr.save();
      }
    }

    await progressTracker.deleteOne();

    res.status(200).json({
      success: true,
      data: "Progress Tracker record deleted successfully.",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      data: [],
      error: "Something went wrong while deleting the Progress Tracker record.",
    });
  }
});

module.exports = router;
