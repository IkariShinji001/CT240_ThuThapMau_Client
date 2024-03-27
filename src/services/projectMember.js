import api from "./api.service";
class ProjectService {
  constructor() {
    this.path = "/api/v1/project-member";
  }

  async getProjectMember(projectId){
   return (await api.get(`${this.path}/projects/${projectId}`)).data;
  }
  
}

export default new ProjectService();
