import api from "./api.service";
class CollectionsService {
  constructor() {
    this.path = "/api/v1/collections";
  }

  async getCollectionById(collectionId) {
    return (await api.get(`${this.path}/${collectionId}`)).data;
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

  async updateCollection(collection_id, payload) {
    return (await api.patch(`${this.path}/${collection_id}`, payload)).data;
  }
}

export default new CollectionsService();
