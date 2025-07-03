import mongoose from "mongoose";

const EntrySchema = new mongoose.Schema({
  ss58Address: { type: String, required: true, unique: true },

  projectTitle: String,
  projectSummary: String,
  background: String,
  techStack: String,
  gitLink: String,
  demoLink: String,
  milestoneTitle: String,
  milestoneDescription: String,
  deliverable1: String,
  deliverable2: String,
  deliverable3: String,
  successCriteria: String,
  additionalNotes: String,
}, { timestamps: true });

export default mongoose.model("Entry", EntrySchema);
