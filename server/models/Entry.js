import mongoose from "mongoose";

const EntrySchema = new mongoose.Schema({
  ss58Address: { type: String, required: true, unique: true },

  id: { type: String, required: true },
  status: { type: String, default: "pending" },
  submittedAt: { type: Date },

  teamName: String,
  projectTitle: String,
  projectSummary: String,
  background: String,
  techStack: String,

  milestoneTitle: String,
  milestoneDescription: String,
  successCriteria: String,
  hasOtherMilestones: Boolean,

  deliverables: [String], // array of strings (deliverable values)

  gitLink: String,
  demoLink: String,
  additionalNotes: String
}, { timestamps: true });

export default mongoose.model("Entry", EntrySchema);
