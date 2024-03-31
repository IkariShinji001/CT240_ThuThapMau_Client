import api from "./api.service";
class AttributeService {
  constructor() {
    this.path = "/api/v1/collections";
  }

  async getCollectionByProjectId(projectId) {
    return (await api.get(`${this.path}/projects/${projectId}`)).data;
  }


  
}

export default new AttributeService();