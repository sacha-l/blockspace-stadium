import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  projectName: { type: String, required: true },
  teamMembers: [{
    name: { type: String, required: true },
    customUrl: { type: String },
    walletAddress: { type: String }
  }],
  description: { type: String, required: true },
  hackathon: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    endDate: { type: Date, required: true }
  },
  projectRepo: { type: String },
  demoUrl: { type: String },
  slidesUrl: { type: String },
  techStack: { type: [String], required: true },
  milestones: [{
    description: { type: String, required: true },
    // currator on chain metadata
    createdAt: { type: Date, required: true },
    createdBy: { type: String, required: true },
    updatedAt: { type: Date, required: true },
    updatedBy: { type: String, required: true },
  }],
  bountyPrize: [{
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    hackathonWonAtId: { type: String, required: true },
  }],
  donationAddress: { type: String, required: false },
  projectState: { type: String, required: true },
  // Flag to indicate if all milestones/bounties have been paid out or finalized (i.e. project abandoned).
  bountiesProcessed: { type: Boolean, default: false, required: true },
}, { timestamps: true });

export default mongoose.model("Project", ProjectSchema, "projects");
