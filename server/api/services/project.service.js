import projectRepository from '../repositories/project.repository.js';

class ProjectService {
    async getProjectById(projectId) {
        return await projectRepository.getProjectById(projectId);
    }

    async createProject(projectData) {
        return await projectRepository.createProject(projectData);
    }

    async upsertProject(projectId, projectData) {
        return await projectRepository.upsertProject(projectId, projectData);
    }

    async getAllProjects(queryParams) {
        const {
            page = 1,
            limit = 10,
            search,
            projectState,
            bountiesProcessed,
            sortBy = 'updatedAt',
            sortOrder = 'desc',
            hackathonId,
            winnersOnly,
        } = queryParams;

        const query = {};
        if (search) {
            query.projectName = { $regex: search, $options: "i" };
        }
        if (projectState) {
            query.projectState = projectState;
        }
        if (bountiesProcessed !== undefined) {
            query.bountiesProcessed = bountiesProcessed === 'true';
        }
        if (hackathonId) {
            query['hackathon.id'] = hackathonId;
        }
        // winnersOnly can be boolean or string
        const winnersOnlyBool = typeof winnersOnly === 'string' ? winnersOnly === 'true' : Boolean(winnersOnly);
        if (winnersOnlyBool) {
            if (hackathonId) {
                query.bountyPrize = { $elemMatch: { hackathonWonAtId: hackathonId } };
            } else {
                // Non-empty bountyPrize array
                query.bountyPrize = { $exists: true, $not: { $size: 0 } };
            }
        }

        const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

        const { projects, total } = await projectRepository.getAllProjects(query, page, limit, sortOptions);

        return {
            data: projects,
            meta: {
                total,
                count: projects.length,
                limit: parseInt(limit, 10) || 10,
                page: parseInt(page, 10)
            }
        };
    }

    async updateProject(projectId, updateData) {
        return await projectRepository.updateProject(projectId, updateData);
    }
}

export default new ProjectService();