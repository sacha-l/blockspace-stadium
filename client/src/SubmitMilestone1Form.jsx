import {
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Code,
  ExternalLink,
  Github,
  Lightbulb,
  Upload,
  Loader,
} from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import api from "./services/api";

export default function SubmitMilestone1Form({
  sessionAddress,
  formData,
  loaded,
  onInputChange,
}) {
  // Change: Use array for deliverables, default to 1
  const [deliverables, setDeliverables] = useState(["deliverable1"]);
  const [completedDeliverables, setCompletedDeliverables] = useState({
    deliverable1: false,
  });
  const [expandedSections, setExpandedSections] = useState({
    projectOverview: true,
    technicalDetails: true,
    milestoneDetails: true,
    deliverables: true,
  });

  const handleDeliverableToggle = (deliverable) => {
    setCompletedDeliverables((prev) => ({
      ...prev,
      [deliverable]: !prev[deliverable],
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Tech stack chips state
  const [techStackChips, setTechStackChips] = useState(
    formData.techStack
      ? formData.techStack
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : []
  );
  const [techInput, setTechInput] = useState("");
  const techInputRef = useRef(null);

  // Add chip on Enter or comma
  const handleTechInputKeyDown = (e) => {
    if (
      (e.key === "Enter" || e.key === "," || e.key === "Tab") &&
      techInput.trim()
    ) {
      e.preventDefault();
      if (!techStackChips.includes(techInput.trim())) {
        setTechStackChips([...techStackChips, techInput.trim()]);
      }
      setTechInput("");
    }
  };

  // Remove chip
  const handleRemoveChip = (chip) => {
    setTechStackChips(techStackChips.filter((c) => c !== chip));
  };

  // On submit, join chips into comma string
  const handleSubmit = async (formData) => {
    try {
      const response = await api.submitEntry({
        ...formData,
        sessionAddress,
        techStack: techStackChips.join(", "),
      });
      console.log("✅ Entry submitted:", response);
      toast.success("Milestone submitted successfully!");
    } catch (error) {
      console.error("❌ Submission failed:", error.message || error);
      toast.error("Submission failed. Please try again.");
    }
  };

  // Add deliverable handler
  const handleAddDeliverable = () => {
    const nextIndex = deliverables.length + 1;
    const newKey = `deliverable${nextIndex}`;
    setDeliverables((prev) => [...prev, newKey]);
    setCompletedDeliverables((prev) => ({ ...prev, [newKey]: false }));
  };

  // Delete deliverable handler (cannot delete first)
  const handleDeleteDeliverable = (deliverable, index) => {
    if (index === 0) return; // Prevent deleting the first deliverable
    setDeliverables((prev) => prev.filter((d) => d !== deliverable));
    setCompletedDeliverables((prev) => {
      const copy = { ...prev };
      delete copy[deliverable];
      return copy;
    });
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        <div className="space-y-6">
          {/* Header */}
          {/* <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Milestone Submission
            </h1>
            <p className="text-gray-600 mt-2">
              Complete the form to submit your MVP prototype
            </p>
          </div> */}

          {/* Project Overview Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div
              className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection("projectOverview")}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Project Overview
                </h2>
              </div>
              {expandedSections.projectOverview ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>

            {expandedSections.projectOverview && (
              <div className="px-6 pb-6 space-y-5">
                <div className="grid grid-cols-1 gap-5">
                  {/* Team Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Team Name
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="teamName"
                      value={formData.teamName || ""}
                      onChange={onInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Enter your team name"
                      required
                    />
                  </div>
                  {/* ...existing Project Title, Summary, Problem Statement... */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Title
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="projectTitle"
                      value={formData.projectTitle}
                      onChange={onInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Enter your project title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Summary
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                      name="projectSummary"
                      value={formData.projectSummary}
                      onChange={onInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                      placeholder="Briefly describe your project (2-3 sentences)"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Include target users and key value proposition
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Problem Statement
                    </label>
                    <textarea
                      name="background"
                      value={formData.background}
                      onChange={onInputChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                      placeholder="Describe the problem you're solving and current pain points"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Technical Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div
              className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection("technicalDetails")}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                  <Code className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Technical Implementation
                </h2>
              </div>
              {expandedSections.technicalDetails ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>

            {expandedSections.technicalDetails && (
              <div className="px-6 pb-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tech Stack & Tools
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {techStackChips.map((chip, idx) => (
                      <span
                        key={chip}
                        className="flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                      >
                        {chip}
                        <button
                          type="button"
                          className="ml-2 text-purple-400 hover:text-purple-700"
                          onClick={() => handleRemoveChip(chip)}
                          aria-label={`Remove ${chip}`}
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    ref={techInputRef}
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleTechInputKeyDown}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    placeholder="Type a tech/tool and press Enter or comma"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Press Enter or comma to add. Example: React, Node.js,
                    MongoDB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Milestone Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div
              className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection("milestoneDetails")}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-green-50 text-green-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Milestone 1: MVP Prototype
                </h2>
              </div>
              {expandedSections.milestoneDetails ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>

            {expandedSections.milestoneDetails && (
              <div className="px-6 pb-6 space-y-5">
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Milestone Title
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="milestoneTitle"
                      value={formData.milestoneTitle}
                      onChange={onInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="Name your milestone"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                      name="milestoneDescription"
                      value={formData.milestoneDescription}
                      onChange={onInputChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none"
                      placeholder="Describe what you built during the 3-day hackathon"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Focus on core functionality
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GitHub Repository
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Github className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="url"
                          name="gitLink"
                          value={formData.gitLink}
                          onChange={onInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                          placeholder="https://github.com/username/repo"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Demo Link
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <ExternalLink className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="url"
                          name="demoLink"
                          value={formData.demoLink}
                          onChange={onInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                          placeholder="https://your-demo-url.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Deliverables Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div
              className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection("deliverables")}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Deliverables Checklist
                </h2>
              </div>
              {expandedSections.deliverables ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>

            {expandedSections.deliverables && (
              <div className="px-6 pb-6 space-y-6">
                {deliverables.map((deliverable, index) => (
                  <div key={deliverable} className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <button
                        type="button"
                        onClick={() => handleDeliverableToggle(deliverable)}
                        className={`mt-1 flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                          completedDeliverables[deliverable]
                            ? "bg-green-500 border-green-500"
                            : "border-gray-300 hover:border-green-400"
                        }`}
                      >
                        {completedDeliverables[deliverable] && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Deliverable {index + 1}
                          {index === 0 && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </label>
                        <textarea
                          name={deliverable}
                          value={formData[deliverable] || ""}
                          onChange={onInputChange}
                          rows="2"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                          placeholder={`Describe specific, measurable outcome ${
                            index + 1
                          }...`}
                          required={index === 0}
                        />
                      </div>
                      {/* Delete button for deliverables except the first */}
                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteDeliverable(deliverable, index)
                          }
                          className="ml-2 mt-2 text-red-500 hover:text-red-700"
                          title="Delete deliverable"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddDeliverable}
                  className="mt-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors text-sm font-medium"
                >
                  + Add Deliverable
                </button>
              </div>
            )}
          </div>

          {/* Submit Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <h3 className="font-medium text-gray-900">Ready to submit?</h3>
                <p className="text-sm text-gray-500">
                  Ensure all required fields are completed
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit(formData)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Submit Milestone
                </button>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Timeline: 3-day hackathon completion
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
