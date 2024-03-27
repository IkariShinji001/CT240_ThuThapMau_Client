import api from "./api.service";
class ProjectService {
  constructor() {
    this.path = "/api/v1/project-member";
  }

  async getProjectMember(projectId, accept_status){
   return (await api.get(`${this.path}/projects/${projectId}`, {params: {accept_status}} )).data;
  }
  
}

export default new ProjectService();
