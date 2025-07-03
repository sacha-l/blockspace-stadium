import {
  CheckCircle,
  Calendar,
  Code,
  Lightbulb,
  Target,
  Users,
  Award,
  Github,
  ExternalLink,
} from "lucide-react";

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

  const StatusBadge = ({ completed }) => (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        completed
          ? "bg-green-100 text-green-800 border border-green-200"
          : "bg-gray-100 text-gray-600 border border-gray-200"
      }`}
    >
      <CheckCircle
        className={`w-4 h-4 mr-2 ${
          completed ? "text-green-600" : "text-gray-400"
        }`}
      />
      {completed ? "Completed" : "Pending"}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-3xl mb-6 shadow-2xl">
            <Award className="w-12 h-12 text-white" />
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
              {submissionInfo?.projectTitle}
            </h1>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Submitted: {submissionInfo?.submittedDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>{submissionInfo?.timeline}</span>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-4">
              <a
                href={submissionInfo?.githubRepo}
                className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors duration-200"
              >
                <Github className="w-5 h-5 mr-2" />
                View Code
              </a>
              <a
                href={submissionInfo?.liveDemo}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Live Demo
              </a>
            </div>
          </div>
        </div>

        {/* Project Overview */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6">
            <div className="flex items-center space-x-3">
              <Lightbulb className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white">
                Project Overview
              </h2>
            </div>
          </div>
          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Project Summary
              </h3>
              <p className="text-gray-700 leading-relaxed bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
                {submissionInfo?.projectSummary}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Background & Problem Statement
              </h3>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-xl">
                {submissionInfo?.background}
              </p>
            </div>
          </div>
        </div>

        {/* Technical Implementation */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-8 py-6">
            <div className="flex items-center space-x-3">
              <Code className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white">
                Technical Implementation
              </h2>
            </div>
          </div>
          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Tech Stack & Tools
              </h3>
              <p className="text-gray-700 leading-relaxed bg-purple-50 p-6 rounded-xl border-l-4 border-purple-500">
                {submissionInfo?.techStack}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Curators & Mentors
              </h3>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-xl">
                {submissionInfo?.curators}
              </p>
            </div>
          </div>
        </div>

        {/* Milestone Achievement */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">
                  Milestone 1: {submissionInfo?.milestoneTitle}
                </h2>
              </div>
              <StatusBadge completed={true} />
            </div>
          </div>
          <div className="p-8">
            <p className="text-gray-700 leading-relaxed bg-green-50 p-6 rounded-xl border-l-4 border-green-500 mb-8">
              {submissionInfo?.milestoneDescription}
            </p>

            {/* Deliverables */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Deliverables Achieved
              </h3>
              {[submissionInfo?.deliverables1, submissionInfo?.deliverables2, submissionInfo?.deliverables3].map((deliverable, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        {""}
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        {deliverable}
                      </p>
                      <div className="mt-3">
                        <StatusBadge completed={""} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Success Criteria & Notes */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-8 py-6">
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white">
                Success Criteria & Results
              </h2>
            </div>
          </div>
          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Success Criteria Met
              </h3>
              <p className="text-gray-700 leading-relaxed bg-teal-50 p-6 rounded-xl border-l-4 border-teal-500">
                {submissionInfo?.successCriteria}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Additional Notes & Learnings
              </h3>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-xl">
                {submissionInfo?.additionalNotes}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-2xl shadow-xl">
            <Award className="w-6 h-6 mr-3" />
            <span className="text-lg font-bold">
              Milestone 1 Successfully Completed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
