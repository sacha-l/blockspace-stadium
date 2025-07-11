import React, { useState, useMemo } from "react";
import {
  Filter,
  Search,
  X,
  ArrowLeft,
  ExternalLink,
  Github,
  Calendar,
  Users,
  Tag,
  FileText,
  Target,
  CheckCircle,
} from "lucide-react";

const getStatusColor = (status) => {
  const map = {
    active: "bg-green-100 text-green-800",
    upcoming: "bg-blue-100 text-blue-800",
    completed: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
    scored: "bg-green-100 text-green-800",
    under_review: "bg-orange-100 text-orange-800",
  };
  return map[status] || "bg-gray-100 text-gray-800";
};

const SubmissionDetailView = ({ submission, onBack }) => {
  const InfoSection = ({ title, children, icon: Icon }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        {Icon && <Icon className="w-5 h-5 text-purple-600" />}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );

  const DeliverableItem = ({ title, content, number }) => (
    <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium">
        {number}
      </div>
      <div className="flex-1">
        <div className="font-medium text-gray-900 mb-1">{title}</div>
        <div className="text-gray-600 text-sm">{content}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {submission.projectTitle}
            </h2>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-gray-600">by {submission.teamName}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  submission.status
                )}`}
              >
                {submission.status.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {submission.gitLink && (
            <a
              href={submission.gitLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Github className="w-4 h-4" />
              Code
            </a>
          )}
          {submission.demoLink && (
            <a
              href={submission.demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Demo
            </a>
          )}
        </div>
      </div>

      {/* Project Summary */}
      <InfoSection title="Project Summary" icon={FileText}>
        <p className="text-gray-700 leading-relaxed">
          {submission.projectSummary}
        </p>
      </InfoSection>

      {/* Background */}
      <InfoSection title="Background & Problem Statement" icon={Target}>
        <p className="text-gray-700 leading-relaxed">{submission.background}</p>
      </InfoSection>

      {/* Tech Stack */}
      <InfoSection title="Technology Stack" icon={Tag}>
        <div className="flex flex-wrap gap-2">
          {submission.techStack.split(",").map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
            >
              {tech.trim()}
            </span>
          ))}
        </div>
      </InfoSection>

      {/* Milestone */}
      <InfoSection title="Milestone" icon={Calendar}>
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              {submission.milestoneTitle}
            </h4>
            <p className="text-gray-700">{submission.milestoneDescription}</p>
          </div>
        </div>
      </InfoSection>

      {/* Deliverables */}
      <InfoSection title="Deliverables" icon={CheckCircle}>
        <div className="space-y-3">
          {submission.deliverable1 && (
            <DeliverableItem
              number="1"
              title="Primary Deliverable"
              content={submission.deliverable1}
            />
          )}
          {submission.deliverable2 && (
            <DeliverableItem
              number="2"
              title="Secondary Deliverable"
              content={submission.deliverable2}
            />
          )}
          {submission.deliverable3 && (
            <DeliverableItem
              number="3"
              title="Additional Deliverable"
              content={submission.deliverable3}
            />
          )}
        </div>
      </InfoSection>

      {/* Success Criteria */}
      <InfoSection title="Success Criteria" icon={Target}>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-gray-700">{submission.successCriteria}</p>
        </div>
      </InfoSection>

      {/* Additional Notes */}
      {submission.additionalNotes && (
        <InfoSection title="Additional Notes" icon={FileText}>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-gray-700">{submission.additionalNotes}</p>
          </div>
        </InfoSection>
      )}

      {/* Submission Details */}
      <InfoSection title="Submission Details" icon={Users}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">Team</div>
            <div className="text-gray-900">{submission.teamName}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">
              Submitted
            </div>
            <div className="text-gray-900">{submission.submittedAt}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">Status</div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                submission.status
              )}`}
            >
              {submission.status.replace("_", " ")}
            </span>
          </div>
        </div>
      </InfoSection>
    </div>
  );
};

// Enhanced demo data with detailed information
const demoSubmissions = [
  {
    id: 1,
    submissionTitle: "AI-Powered Task Manager",
    projectName: "TaskAI",
    projectTitle: "TaskAI - Intelligent Task Management System",
    teamName: "Code Warriors",
    status: "scored",
    submittedAt: "2 days ago",
    projectSummary:
      "TaskAI is an intelligent task management system that uses AI to prioritize, categorize, and suggest optimal scheduling for tasks based on user behavior patterns and deadlines.",
    background:
      "Traditional task management tools lack intelligence in understanding user priorities and work patterns. Users often struggle with overwhelming task lists and poor time management. TaskAI addresses this by learning from user behavior and providing intelligent recommendations.",
    techStack:
      "React, Node.js, OpenAI API, MongoDB, Express.js, Socket.io, TensorFlow.js",
    gitLink: "https://github.com/codewarriors/taskai",
    demoLink: "https://taskai-demo.vercel.app",
    milestoneTitle: "MVP Development and AI Integration",
    milestoneDescription:
      "Complete the core task management features with basic AI-powered prioritization and user behavior analysis.",
    deliverable1:
      "Fully functional web application with user authentication and task CRUD operations",
    deliverable2:
      "AI-powered task prioritization system with machine learning recommendations",
    deliverable3:
      "Real-time collaboration features and mobile-responsive design",
    successCriteria:
      "Users can create, manage, and receive AI-powered suggestions for their tasks. The system should demonstrate improved productivity metrics compared to traditional task managers.",
    additionalNotes:
      "The team has previous experience with AI integration and is confident in delivering a production-ready solution.",
  },
  {
    id: 2,
    submissionTitle: "Blockchain Voting System",
    projectName: "VoteChain",
    projectTitle: "VoteChain - Secure Blockchain-Based Voting Platform",
    teamName: "Crypto Innovators",
    status: "under_review",
    submittedAt: "1 day ago",
    projectSummary:
      "VoteChain is a secure, transparent, and tamper-proof voting system built on blockchain technology that ensures electoral integrity and provides real-time vote counting.",
    background:
      "Traditional voting systems face challenges with security, transparency, and trust. VoteChain leverages blockchain technology to create an immutable voting record that can be audited by anyone while maintaining voter privacy.",
    techStack: "Ethereum, Solidity, React, Web3.js, MetaMask, IPFS, Node.js",
    gitLink: "https://github.com/cryptoinnovators/votechain",
    demoLink: "https://votechain-demo.netlify.app",
    milestoneTitle: "Smart Contract Development and Testing",
    milestoneDescription:
      "Develop and deploy secure smart contracts for voting with comprehensive testing on testnet.",
    deliverable1:
      "Smart contracts for voter registration, vote casting, and result tabulation",
    deliverable2: "Web-based voting interface with MetaMask integration",
    deliverable3:
      "Admin dashboard for election management and real-time monitoring",
    successCriteria:
      "Successfully conduct a test election with multiple voters, ensure vote integrity, and provide transparent result verification.",
    additionalNotes:
      "Security audit recommendations have been implemented. The system is designed to handle large-scale elections.",
  },
  {
    id: 3,
    submissionTitle: "Smart Home Dashboard",
    projectName: "HomeOS",
    projectTitle: "HomeOS - Comprehensive Smart Home Management Platform",
    teamName: "IoT Masters",
    status: "pending",
    submittedAt: "3 hours ago",
    projectSummary:
      "HomeOS is a unified dashboard that connects and controls all smart home devices through a single, intuitive interface with advanced automation capabilities.",
    background:
      "Smart home ecosystems are fragmented with different apps for different devices. HomeOS creates a unified experience by integrating with multiple IoT protocols and providing intelligent automation.",
    techStack:
      "React Native, Node.js, MQTT, PostgreSQL, Docker, AWS IoT, Python",
    gitLink: "https://github.com/iotmasters/homeos",
    demoLink: "https://homeos-demo.app",
    milestoneTitle: "Multi-Protocol Integration and Automation Engine",
    milestoneDescription:
      "Integrate with major IoT protocols and develop the automation engine for smart home control.",
    deliverable1:
      "Mobile application with device discovery and control capabilities",
    deliverable2: "Automation engine with rule-based and AI-powered scenarios",
    deliverable3: "Energy monitoring and optimization features",
    successCriteria:
      "Successfully connect and control at least 5 different types of smart home devices with working automation scenarios.",
    additionalNotes:
      "The team has access to various IoT devices for testing and demonstration purposes.",
  },
  {
    id: 4,
    submissionTitle: "Machine Learning Predictor",
    projectName: "PredictML",
    projectTitle: "PredictML - Advanced Predictive Analytics Platform",
    teamName: "Data Scientists",
    status: "completed",
    submittedAt: "1 week ago",
    projectSummary:
      "PredictML is a no-code machine learning platform that allows users to build, train, and deploy predictive models without programming knowledge.",
    background:
      "Machine learning requires specialized knowledge that limits its accessibility. PredictML democratizes ML by providing an intuitive interface for building predictive models.",
    techStack:
      "Python, Scikit-learn, TensorFlow, FastAPI, React, PostgreSQL, Docker",
    gitLink: "https://github.com/datascientists/predictml",
    demoLink: "https://predictml-platform.com",
    milestoneTitle: "AutoML Pipeline and Model Deployment",
    milestoneDescription:
      "Complete the automated machine learning pipeline with model training, validation, and deployment capabilities.",
    deliverable1: "Web-based ML model builder with drag-and-drop interface",
    deliverable2: "Automated model training and hyperparameter optimization",
    deliverable3: "Model deployment and API generation system",
    successCriteria:
      "Non-technical users can successfully build and deploy a working machine learning model within 30 minutes.",
    additionalNotes:
      "The platform includes pre-built templates for common use cases like sales forecasting and customer churn prediction.",
  },
  {
    id: 5,
    submissionTitle: "Social Media Analytics",
    projectName: "SocialInsights",
    projectTitle: "SocialInsights - Comprehensive Social Media Analytics Suite",
    teamName: "Analytics Pro",
    status: "active",
    submittedAt: "5 days ago",
    projectSummary:
      "SocialInsights provides comprehensive analytics and insights across multiple social media platforms with AI-powered sentiment analysis and trend prediction.",
    background:
      "Businesses struggle to analyze their social media performance across multiple platforms. SocialInsights aggregates data from various sources and provides actionable insights.",
    techStack:
      "React, Node.js, Python, MongoDB, Redis, Twitter API, Facebook Graph API",
    gitLink: "https://github.com/analyticspro/socialinsights",
    demoLink: "https://socialinsights-demo.herokuapp.com",
    milestoneTitle: "Multi-Platform Integration and AI Analytics",
    milestoneDescription:
      "Integrate with major social media APIs and implement AI-powered analytics for sentiment and trend analysis.",
    deliverable1: "Dashboard with real-time social media metrics and KPIs",
    deliverable2: "AI-powered sentiment analysis and engagement prediction",
    deliverable3: "Automated reporting and alert system",
    successCriteria:
      "Successfully track and analyze social media performance across at least 3 platforms with accurate sentiment analysis.",
    additionalNotes:
      "The team has established partnerships with social media platforms for enhanced API access.",
  },
];

const SubmissionsTab = ({ submissions = demoSubmissions }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Get unique statuses for filter dropdown
  const uniqueStatuses = useMemo(() => {
    const statuses = [...new Set(submissions.map((s) => s.status))];
    return statuses.sort();
  }, [submissions]);

  // Filter submissions based on search and status filter
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((submission) => {
      const matchesSearch =
        searchTerm === "" ||
        submission.submissionTitle
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        submission.projectName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        submission.teamName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "" || submission.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [submissions, searchTerm, statusFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
  };

  const hasActiveFilters = searchTerm !== "" || statusFilter !== "";

  // If a submission is selected, show detail view
  if (selectedSubmission) {
    return (
      <SubmissionDetailView
        submission={selectedSubmission}
        onBack={() => setSelectedSubmission(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Submissions</h2>
          <p className="text-gray-600">Checkout other hackathon submissions</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              showFilters || hasActiveFilters
                ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search submissions, projects, or teams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Filter Controls */}
        {showFilters && (
          <div className="flex flex-wrap gap-4 items-center pt-2 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Status:
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                {uniqueStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Showing {filteredSubmissions.length} of {submissions.length}{" "}
          submissions
          {hasActiveFilters && (
            <span className="ml-2 text-purple-600">(filtered)</span>
          )}
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Submission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Team
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    {submissions.length === 0 ? (
                      "No submissions found"
                    ) : (
                      <>
                        No submissions match your search criteria.
                        {hasActiveFilters && (
                          <button
                            onClick={clearFilters}
                            className="ml-2 text-purple-600 hover:text-purple-800 underline"
                          >
                            Clear filters
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {s.submissionTitle}
                      </div>
                      <div className="text-sm text-gray-500">
                        Submitted {s.submittedAt}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {s.projectName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {s.teamName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          s.status
                        )}`}
                      >
                        {s.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedSubmission(s)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubmissionsTab;
