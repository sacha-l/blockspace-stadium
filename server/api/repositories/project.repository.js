import Project from '../../models/Project.js';

class ProjectRepository {
    async getProjectById(projectId) {
        // First try to find by MongoDB ObjectId
        let project = await Project.findById(projectId).select('-createdAt');
        
        if (project) {
            return project;
        }
        
        // If not found by ObjectId, try to find by donationAddress
        project = await Project.findOne({ donationAddress: projectId }).select('-createdAt');
        
        if (project) {
            return project;
        }
        
        // If still not found, try to find by generated ID pattern
        // Look for projects where the projectName matches the pattern
        if (projectId.includes('-')) {
            // Try to find by project name pattern
            // Convert the URL slug back to a readable project name
            const projectNamePattern = projectId
                .split('-')
                .map(part => part.charAt(0).toUpperCase() + part.slice(1)) // Capitalize first letter
                .join(' ');
            
            // Search by project name (case-insensitive, partial match)
            project = await Project.findOne({
                projectName: { $regex: new RegExp(projectNamePattern.replace(/\s+/g, '.*'), 'i') }
            }).select('-createdAt');
            
            if (project) {
                return project;
            }
            
            // If still not found, try a more flexible search
            // Split the ID and search for projects containing these words
            const searchTerms = projectId.split('-').filter(term => term.length > 2);
            if (searchTerms.length > 0) {
                const searchQuery = searchTerms.map(term => ({
                    $or: [
                        { projectName: { $regex: new RegExp(term, 'i') } },
                        { 'teamMembers.name': { $regex: new RegExp(term, 'i') } }
                    ]
                }));
                
                project = await Project.findOne({
                    $and: searchQuery
                }).select('-createdAt');
                
                if (project) {
                    return project;
                }
            }
        }
        
        // If nothing found, return null
        return null;
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