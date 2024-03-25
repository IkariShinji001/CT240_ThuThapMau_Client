import api from "./api.service";
class ProjectService {
  constructor() {
    this.path = "/api/v1/projects";
  }

  async getProjectById(projectId) {
    return (await api.get(`${this.path}/${projectId}`)).data;
  }

  async getAllProject(userId){
    return (await api.get(`${this.path}/users/${userId}`, {params:{accept_status:2}})).data
  }
}

export default new ProjectService();
