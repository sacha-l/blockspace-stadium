import mongoose from "mongoose";

const EntrySchema = new mongoose.Schema({
  ss58Address: { type: String, required: true, unique: true },

  teamName: String,
  projectTitle: String,
  projectSummary: String,
  background: String,
  techStack: String,
  gitLink: String,
  demoLink: String,
  milestoneTitle: String,
  milestoneDescription: String,
  status: String,
  deliverable: String,
  successCriteria: String,
  additionalNotes: String,
}, { timestamps: true });

export default mongoose.model("Entry", EntrySchema);
