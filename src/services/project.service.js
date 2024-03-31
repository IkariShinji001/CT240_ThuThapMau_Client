import api from "./api.service";
class ProjectService {
  constructor() {
    this.path = "/api/v1/projects";
  }

  async getProjectById(projectId) {
    return (await api.get(`${this.path}/${projectId}`)).data;
  }

  async updateProjectById(projectId, payload) {
    return (await api.patch(`${this.path}/${projectId}`, payload)).data;
  }

  async checkIsOwnerProject(userId, projectId) {
    return (await api.get(`${this.path}/${projectId}/users/${userId}`)).data;
  }

  async updateProjectById(projectId, payload) {
    return (await api.patch(`${this.path}/${projectId}`, payload)).data;
  }

  async checkIsOwnerProject(userId, projectId) {
    return (await api.get(`${this.path}/${projectId}/users/${userId}`)).data;
  }

  async getAllProject(userId, accept_status){
    return (await api.get(`${this.path}/users/${userId}`, {params:{accept_status}})).data
  }
}

export default new ProjectService();
