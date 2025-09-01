/**
 * Utility functions for project data handling
 */

/**
 * Generate a consistent project ID from project data
 * This creates a URL-friendly slug from the project name and team lead
 */
export function generateProjectId(project: { projectName: string; teamLead: string }): string {
  const nameSlug = project.projectName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  const teamSlug = project.teamLead
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  return `${nameSlug}-${teamSlug}`;
}

/**
 * Get the best available project identifier for routing
 * Priority: id > donationAddress > generatedId > fallback
 * Note: We prioritize existing IDs since the server already has proper project IDs
 */
export function getProjectRouteId(project: { 
  id?: string; 
  projectName: string; 
  teamLead: string; 
  donationAddress?: string 
}): string {
  // Use existing ID if available (this is the best option)
  if (project.id) {
    return project.id;
  }
  
  // Use donation address if available
  if (project.donationAddress && project.donationAddress.trim() !== '') {
    return project.donationAddress;
  }
  
  // Generate ID from project name and team lead as fallback
  const generatedId = generateProjectId(project);
  return generatedId;
}

/**
 * Generate a project URL using the best available identifier
 */
export function getProjectUrl(project: { 
  id?: string; 
  projectName: string; 
  teamLead: string; 
  donationAddress?: string 
}): string {
  const routeId = getProjectRouteId(project);
  return `/projects/${routeId}`;
}
