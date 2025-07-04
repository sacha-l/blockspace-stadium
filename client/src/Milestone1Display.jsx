import {
  Award,
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Code,
  ExternalLink,
  Github,
  Lightbulb,
  Target,
  User,
} from "lucide-react";
import { useState } from "react";

export default function Milestone1Display({ submissionInfo }) {
  // Sample data for a completed submission
  const projectData = {
    projectTitle: "EcoTrack - Personal Carbon Footprint Tracker",
    projectSummary:
      "A mobile-first web application that helps individuals track, analyze, and reduce their daily carbon footprint through gamification and AI-powered recommendations. Target users are environmentally conscious millennials and Gen-Z who want to make a positive impact. Key value proposition: making sustainability engaging and accessible through personalized insights and community challenges.",
    background:
      "Climate change is one of the most pressing issues of our time, yet many individuals feel overwhelmed and don't know where to start with reducing their environmental impact. Current carbon tracking apps are either too complex for daily use or lack engaging features to maintain user motivation. People need a simple, intuitive way to understand their environmental impact and receive actionable recommendations for improvement. Our solution addresses the gap between environmental awareness and practical action.",
    techStack:
      "React Native for cross-platform mobile development, Node.js and Express.js for backend API, PostgreSQL for user data and carbon calculations, Firebase for real-time features and authentication, Chart.js for data visualization, OpenAI API for personalized recommendations, Stripe for premium features, Docker for containerization, and AWS for cloud hosting and deployment.",
    curators:
      "Dr. Sarah Chen (Environmental Data Science Professor at Stanford) - Expert in carbon footprint analysis and sustainability metrics, will provide guidance on accurate carbon calculations and environmental impact validation. Mark Rodriguez (Senior Product Manager at Patagonia) - Expertise in sustainable product development and user engagement, will mentor on user experience and market fit strategies.",
    milestoneTitle: "EcoTrack MVP - Core Tracking & Dashboard",
    milestoneDescription:
      "During the 3-day hackathon, we built a fully functional web application with user authentication, carbon footprint tracking for transportation and energy consumption, an interactive dashboard with data visualizations, and basic AI-powered recommendations engine. The core functionality demonstrates real-time carbon calculation, user progress tracking, and personalized sustainability tips based on user behavior patterns.",
    deliverables: [
      {
        title: "Functional User Authentication & Onboarding System",
        description:
          "Complete user registration, login, and personalized onboarding flow with carbon footprint baseline calculation",
        completed: true,
      },
      {
        title: "Carbon Tracking Dashboard with Data Visualization",
        description:
          "Interactive dashboard displaying daily, weekly, and monthly carbon footprint with charts and progress indicators",
        completed: true,
      },
      {
        title: "AI-Powered Recommendations Engine",
        description:
          "Smart recommendation system providing personalized sustainability tips based on user data and behavior patterns",
        completed: true,
      },
    ],
    successCriteria:
      "Milestone 1 is complete when we have a working web application that can successfully onboard new users, track their carbon footprint for at least 3 categories (transportation, energy, food), display meaningful data visualizations, and provide at least 5 personalized recommendations per user. The application should be deployed and accessible via web browser with responsive design for mobile devices.",
    additionalNotes:
      "Challenges faced included integrating accurate carbon calculation APIs and ensuring real-time data updates. We successfully implemented a caching system for better performance and added offline capability for mobile users. The AI recommendation engine exceeded expectations by providing contextually relevant tips. User testing with 5 beta users showed 90% engagement rate and positive feedback on the interface design.",
    timeline: "3-day hackathon",
    submittedDate: "March 15, 2024",
    teamMembers: ["Alex Chen", "Sarah Johnson", "Mike Rodriguez"],
    githubRepo: "https://github.com/team/ecotrack-mvp",
    liveDemo: "https://ecotrack-demo.vercel.app",
  };

  const [expandedSections, setExpandedSections] = useState({
    projectOverview: true,
    technicalDetails: true,
    milestoneDetails: true,
    successCriteria: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const StatusBadge = ({ completed }) => (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        completed ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
      }`}
    >
      {completed ? (
        <CheckCircle className="w-4 h-4 mr-1.5 text-green-500" />
      ) : (
        <Clock className="w-4 h-4 mr-1.5 text-gray-500" />
      )}
      {completed ? "Completed" : "In Progress"}
    </span>
  );

  const data = submissionInfo || projectData;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mb-6 shadow-md">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {data.projectTitle}
          </h1>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <span>Submitted: {data.submittedDate}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2 text-gray-500" />
              <span>{data.timeline}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <User className="w-4 h-4 mr-2 text-gray-500" />
              <span>Team: {data?.teamMembers?.join(", ")}</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={data.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              <Github className="w-4 h-4 mr-2" />
              View Code
            </a>
            <a
              href={data.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-colors text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Live Demo
            </a>
          </div>
        </div>

        {/* Project Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
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
            <div className="px-6 pb-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Project Summary
                </h3>
                <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  {data.projectSummary}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Background & Problem Statement
                </h3>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {data.background}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Technical Implementation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
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
            <div className="px-6 pb-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Tech Stack & Tools
                </h3>
                <p className="text-gray-700 leading-relaxed bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                  {data.techStack}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Curators & Mentors
                </h3>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {data.curators}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Milestone Achievement */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div
            className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection("milestoneDetails")}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Milestone 1: {data.milestoneTitle}
                </h2>
                <div className="flex items-center mt-1">
                  <StatusBadge completed={true} />
                </div>
              </div>
            </div>
            {expandedSections.milestoneDetails ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>

          {expandedSections.milestoneDetails && (
            <div className="px-6 pb-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  {data.milestoneDescription}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Deliverables Achieved
                </h3>
                <div className="space-y-4">
                  {data?.deliverables?.map((deliverable, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`flex-shrink-0 mt-1 w-5 h-5 rounded-full flex items-center justify-center ${
                            deliverable.completed
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        >
                          {deliverable.completed && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">
                            {deliverable.title}
                          </h4>
                          <p className="text-gray-600 text-sm mt-1">
                            {deliverable.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Success Criteria & Notes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div
            className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection("successCriteria")}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
                <Target className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Success Criteria & Results
              </h2>
            </div>
            {expandedSections.successCriteria ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>

          {expandedSections.successCriteria && (
            <div className="px-6 pb-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Success Criteria Met
                </h3>
                <p className="text-gray-700 leading-relaxed bg-teal-50 p-4 rounded-lg border-l-4 border-teal-500">
                  {data.successCriteria}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Additional Notes & Learnings
                </h3>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {data.additionalNotes}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Completion Badge */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-sm">
            <Award className="w-5 h-5 mr-2" />
            <span className="font-medium">
              Milestone 1 Successfully Completed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
