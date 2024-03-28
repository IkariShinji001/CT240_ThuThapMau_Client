import api from "./api.service";
class ProjectService {
  constructor() {
    this.path = "/api/v1/projects";
  }

  async getProjectById(projectId) {
    return (await api.get(`${this.path}/${projectId}`)).data;
  }

  async getAllProject(userId, accept_status){
    return (await api.get(`${this.path}/users/${userId}`, {params:{accept_status}})).data
  }
  
  async createProject(newProject){
    const form = new FormData()
    
    const response = await api.post(`${this.path}/`, newProject, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
}

export default new ProjectService();
