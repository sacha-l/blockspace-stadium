import {
  mockProjects,
  mockPayouts,
  Project,
  Payout,
  adminCredentials,
} from "./mockData";

import { api } from "./api";
import synergyProjects from '@/data/synergy-2025.json';

// Simulate network delays
const delay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Local storage keys
const STORAGE_KEYS = {
  PROJECTS: "hackathonia_projects",
  PAYOUTS: "hackathonia_payouts",
  ADMIN_SESSION: "hackathonia_admin_session",
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
  // Get all projects (using mock data for demo)
  getProjects: async (): Promise<Project[]> => {
    await delay();

    // HARDCODED: Return mock data instead of API call for demo purposes
    console.log("📋 Using mock data for projects demo");
    return mockProjects;
    
    // Original API call (commented out for demo):
    // try {
    //   const response = await api.getProjects(/* { limit: 10 } */);
    //   return response.data;
    // } catch (err) {
    //   console.error("❌ Failed to fetch projects:", err);
    //   return [];
    // }
  },

  // Get project by ID (ss58Address)
  getProject: async (id: string): Promise<any | null> => {
    await delay();
    // Search synergyProjects for a project with matching donationAddress
    const project = synergyProjects.find((p: any) => p.donationAddress === id);
    return project || null;
  },

  // Submit new project
  submitProject: async (
    projectData: any
  ): Promise<{ status: string; project: Project }> => {
    await delay();

    try {
      const newProject: Project = {
        ...projectData,
        id: `project-${Date.now()}`,
        status: "pending",
        submittedAt: new Date().toISOString(),
      };

      const result = await api.submitEntry(newProject);

      console.log(result);
      if (result.status !== "success") {
        throw new Error(result.message || "Failed to submit project");
      }

      return { status: result.status, project: newProject };
    } catch (err: any) {
      console.error("❌ submitProject error:", err);
      throw new Error(err.message || "Unexpected error");
    }
  },

  // Update project status (admin only)
  updateProjectStatus: async (
    ss58Address: string,
    status: Project["status"]
  ): Promise<Project> => {
    await delay();

    try {
      const result = await api.updateProjectStatus(ss58Address, status);

      if (result.status !== "success") {
        throw new Error(result.message || "Failed to update project status");
      }

      return result.data as Project;
    } catch (err: any) {
      console.error("❌ updateProjectStatus error:", err);
      throw new Error(err.message || "Unexpected error while updating status");
    } finally {
      // Refresh projects after status update

      api.getProjects();
      console.log("🔄 Refreshing projects after status update");
    }
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
