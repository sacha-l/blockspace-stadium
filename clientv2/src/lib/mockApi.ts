import {
  mockProjects,
  mockPayouts,
  Project,
  Payout,
  adminCredentials,
} from "./mockData";

// Simulate network delays
const delay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Local storage keys
const STORAGE_KEYS = {
  PROJECTS: "hackthonia_projects",
  PAYOUTS: "hackthonia_payouts",
  ADMIN_SESSION: "hackthonia_admin_session",
};

// Initialize local storage with mock data
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(mockProjects));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PAYOUTS)) {
    localStorage.setItem(STORAGE_KEYS.PAYOUTS, JSON.stringify(mockPayouts));
  }
};

// Initialize on import
initializeStorage();

// Storage helpers
const getStoredProjects = (): Project[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  return stored ? JSON.parse(stored) : mockProjects;
};

const setStoredProjects = (projects: Project[]) => {
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
};

const getStoredPayouts = (): Payout[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PAYOUTS);
  return stored ? JSON.parse(stored) : mockPayouts;
};

const setStoredPayouts = (payouts: Payout[]) => {
  localStorage.setItem(STORAGE_KEYS.PAYOUTS, JSON.stringify(payouts));
};

// Project API
export const projectApi = {
  // Get all projects
  getProjects: async (): Promise<Project[]> => {
    await delay();
    return getStoredProjects();
  },

  // Get project by ID
  getProject: async (id: string): Promise<Project | null> => {
    await delay();
    const projects = getStoredProjects();
    return projects.find((p) => p.id === id) || null;
  },

  // Submit new project
  submitProject: async (
    projectData: Omit<Project, "id" | "status" | "submittedAt">
  ): Promise<Project> => {
    await delay();

    const projects = getStoredProjects();

    // Check if ss58Address already exists
    const existingProject = projects.find(
      (p) => p.ss58Address === projectData.ss58Address
    );
    if (existingProject) {
      throw new Error("A project with this address already exists");
    }

    const newProject: Project = {
      ...projectData,
      id: `project-${Date.now()}`,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };

    const updatedProjects = [...projects, newProject];
    setStoredProjects(updatedProjects);

    return newProject;
  },

  // Update project status (admin only)
  updateProjectStatus: async (
    id: string,
    status: Project["status"]
  ): Promise<Project> => {
    await delay();

    const projects = getStoredProjects();
    const projectIndex = projects.findIndex((p) => p.id === id);

    if (projectIndex === -1) {
      throw new Error("Project not found");
    }

    projects[projectIndex].status = status;
    setStoredProjects(projects);

    return projects[projectIndex];
  },
};

// Admin API
export const adminApi = {
  // Login (mock authentication)
  login: async (password: string): Promise<boolean> => {
    await delay(500);

    if (password === adminCredentials.password) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, "authenticated");
      return true;
    }

    throw new Error("Invalid password");
  },

  // Check if admin is authenticated
  isAuthenticated: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === "authenticated";
  },

  // Logout
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  },

  // Create payout
  createPayout: async (
    payoutData: Omit<Payout, "id" | "status" | "createdAt">
  ): Promise<Payout> => {
    await delay();

    const payouts = getStoredPayouts();

    const newPayout: Payout = {
      ...payoutData,
      id: `payout-${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const updatedPayouts = [...payouts, newPayout];
    setStoredPayouts(updatedPayouts);

    // Simulate payout processing
    setTimeout(() => {
      const currentPayouts = getStoredPayouts();
      const payoutIndex = currentPayouts.findIndex(
        (p) => p.id === newPayout.id
      );
      if (payoutIndex !== -1) {
        currentPayouts[payoutIndex].status = "completed";
        setStoredPayouts(currentPayouts);
      }
    }, 3000);

    return newPayout;
  },

  // Get all payouts
  getPayouts: async (): Promise<Payout[]> => {
    await delay();
    return getStoredPayouts();
  },
};

// Error types for better error handling
export class ApiError extends Error {
  constructor(message: string, public status: number = 400) {
    super(message);
    this.name = "ApiError";
  }
}
