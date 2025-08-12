import projectService from '../services/project.service.js';

class ProjectController {
    async getProjectById(req, res) {
        try {
            const { projectId } = req.params;
            const project = await projectService.getProjectById(projectId);
            if (!project) {
                return res.status(404).json({ status: "error", message: "Project not found" });
            }
            res.status(200).json({ status: "success", data: project });
        } catch (error) {
            console.error("❌ Error fetching project:", error);
            res.status(500).json({ status: "error", message: "Server error" });
        }
    }

    async createProject(req, res) {
        try {
            const projectData = req.body || {};
            const created = await projectService.createProject(projectData);
            res.status(201).json({ status: "success", data: created });
        } catch (error) {
            console.error("❌ Error creating project:", error);
            res.status(500).json({ status: "error", message: "Failed to create project" });
        }
    }

    async getAllProjects(req, res) {
        try {
            const result = await projectService.getAllProjects(req.query);
            res.status(200).json({ status: "success", ...result });
        } catch (error) {
            console.error("❌ Error fetching projects:", error);
            res.status(500).json({ status: "error", message: "Failed to fetch projects" });
        }
    }

    async updateProject(req, res) {
        try {
            const { projectId } = req.params;
            const updateData = req.body;

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ status: "error", message: "Request body cannot be empty." });
            }
            
            const updatedProject = await projectService.updateProject(projectId, updateData);
            
            if (!updatedProject) {
                return res.status(404).json({ status: "error", message: "Project not found" });
            }
            
            res.status(200).json({ status: "success", data: updatedProject });
        } catch (error) {
            console.error("❌ Error updating project:", error);
            res.status(500).json({ status: "error", message: "Failed to update project" });
        }
    }
}

export default new ProjectController();