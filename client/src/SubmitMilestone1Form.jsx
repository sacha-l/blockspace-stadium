import { useState, useEffect } from "react";
import api from "./services/api";

import {
  CheckCircle,
  Upload,
  Users,
  Target,
  Calendar,
  Code,
  Lightbulb,
} from "lucide-react";

export default function SubmitMilestone1Form({ sessionAddress }) {
  const [formData, setFormData] = useState({
    ss58Address: sessionAddress,
    projectTitle: "",
    projectSummary: "",
    background: "",
    techStack: "",
    gitLink: "",
    demoLink: "",
    milestoneTitle: "",
    milestoneDescription: "",
    deliverable1: "",
    deliverable2: "",
    deliverable3: "",
    successCriteria: "",
    additionalNotes: "",
  });

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const ss58Address = sessionAddress;
    const fetchData = async () => {
      try {
        const result = await api.getEntryByAddress(ss58Address);
        console.log(result);
        if (result) {
          setLoaded(true);
          setFormData({
            ss58Address: sessionAddress || "",
            projectTitle: result.projectTitle || "",
            projectSummary: result.projectSummary || "",
            background: result.background || "",
            techStack: result.techStack || "",
            gitLink: result.gitLink || "",
            demoLink: result.demoLink || "",
            milestoneTitle: result.milestoneTitle || "",
            milestoneDescription: result.milestoneDescription || "",
            deliverable1: result.deliverable1 || "",
            deliverable2: result.deliverable2 || "",
            deliverable3: result.deliverable3 || "",
            successCriteria: result.successCriteria || "",
            additionalNotes: result.additionalNotes || "",
          });

          console.log({formData});
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    };

    console.log("----");
    console.log({formData});

    fetchData();
  }, []);

  const [completedDeliverables, setCompletedDeliverables] = useState({
    deliverable1: false,
    deliverable2: false,
    deliverable3: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeliverableToggle = (deliverable) => {
    setCompletedDeliverables((prev) => ({
      ...prev,
      [deliverable]: !prev[deliverable],
    }));
  };

  const handleSubmit = async (formData) => {
    try {
      const response = await api.submitEntry(formData);
      console.log("✅ Entry submitted:", response);
      // Optionally show success UI
    } catch (error) {
      console.error("❌ Submission failed:", error.message || error);
      // Optionally show error UI
    }
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          {/* Spinning circle loader */}
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          {/* Project Overview Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6">
              <div className="flex items-center space-x-3">
                <Lightbulb className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">
                  Project Overview
                </h2>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Project Title
                </label>
                <input
                  type="text"
                  name="projectTitle"
                  value={formData.projectTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-lg"
                  placeholder="Enter your innovative project title..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Project Summary
                </label>
                <textarea
                  name="projectSummary"
                  value={formData.projectSummary}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder="Describe your project in 2-3 sentences, including target users and key value proposition..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Background & Problem Statement
                </label>
                <textarea
                  name="background"
                  value={formData.background}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder="Provide context about the problem you're solving and current pain points..."
                />
              </div>
            </div>
          </div>

          {/* Technical Details Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-8 py-6">
              <div className="flex items-center space-x-3">
                <Code className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">
                  Technical Implementation
                </h2>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Tech Stack & Tools
                </label>
                <textarea
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 resize-none"
                  placeholder="List frameworks, languages, databases, APIs, and tools used..."
                />
              </div>
            </div>
          </div>

          {/* Milestone Details Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-6">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">
                  Milestone 1: MVP Prototype
                </h2>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Milestone Title
                </label>
                <input
                  type="text"
                  name="milestoneTitle"
                  value={formData.milestoneTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 text-lg"
                  placeholder="Working prototype title that represents your MVP..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Description
                </label>
                <textarea
                  name="milestoneDescription"
                  value={formData.milestoneDescription}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 resize-none"
                  placeholder="Describe what you built during the 3-day hackathon, focusing on core functionality..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Github Link
                </label>
                <input
                  type="text"
                  name="gitLink"
                  value={formData.gitLink}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 text-lg"
                  placeholder="Link to your github repo..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Demo Link
                </label>
                <input
                  type="text"
                  name="demoLink"
                  value={formData.demoLink}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 text-lg"
                  placeholder="Link to working prototype of MVP..."
                />
              </div>
            </div>
          </div>

          {/* Deliverables Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">
                  Deliverables Checklist
                </h2>
              </div>
            </div>
            <div className="p-8 space-y-6">
              {["deliverable1", "deliverable2", "deliverable3"].map(
                (deliverable, index) => (
                  <div key={deliverable} className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => handleDeliverableToggle(deliverable)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                          completedDeliverables[deliverable]
                            ? "bg-green-500 border-green-500"
                            : "border-gray-300 hover:border-green-400"
                        }`}
                      >
                        {completedDeliverables[deliverable] && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </button>
                      <label className="text-sm font-semibold text-gray-800">
                        Deliverable {index + 1}
                      </label>
                    </div>
                    <textarea
                      name={deliverable}
                      value={formData[deliverable]}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 resize-none ml-9"
                      placeholder={`Describe specific, measurable outcome ${
                        index + 1
                      }...`}
                    />
                  </div>
                )
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-8">
            <button
              type="button"
              onClick={() => handleSubmit(formData)}
              className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 focus:ring-4 focus:ring-blue-200"
            >
              <Upload className="w-6 h-6 mr-3" />
              Submit Milestone 1
            </button>
            <p className="text-gray-600 mt-4">
              Timeline: 3-day hackathon completion
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
