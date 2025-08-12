import Project from '../../models/Project.js';

class ProjectRepository {
    async getProjectById(projectId) {
        return await Project.findById(projectId).select('-createdAt');
    }

    async createProject(projectData) {
        const project = new Project(projectData);
        return await project.save();
    }

    async upsertProject(projectId, projectData) {
        return await Project.findByIdAndUpdate(
            projectId,
            projectData,
            { upsert: true, new: true, setDefaultsOnInsert: true }
        ).select('-createdAt');
    }

    async getAllProjects(query, page, limit, sortOptions) {
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10) || 10;
        
        const projects = await Project.find(query)
            .select('-__v -createdAt')
            .sort(sortOptions)
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);
            
        const total = await Project.countDocuments(query);

        return { projects, total };
    }

    // TODO: Add team member sub route for simple adding without resubmitting the member data
    async updateProject(projectId, updateData) {
        return await Project.findByIdAndUpdate(
            projectId,
            { $set: updateData },
            { new: true }
        ).select('-createdAt');
    }
}

export default new ProjectRepository();