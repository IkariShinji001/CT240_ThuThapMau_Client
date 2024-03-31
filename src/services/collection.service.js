import api from "./api.service";
class CollectionsService {
  constructor() {
    this.path = "/api/v1/collections";
  }

  async getCollectionByProjectId(projectId) {
    return (await api.get(`${this.path}/projects/${projectId}`)).data;
  }

  async createCollection(collection) {
    const formData = new FormData();
    for (const key in collection) {
      formData.append(key, collection[key]);
    }
    return (
      await api.post(`${this.path}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  }
}

export default new CollectionsService();
