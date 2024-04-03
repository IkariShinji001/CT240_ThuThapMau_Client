import api from "./api.service";
class CollectionFormService {
  constructor() {
    this.path = "/api/v1/collection-forms";
  }

  async getCollectionFormByCollectionId(collectionId) {
    return (await api.get(`${this.path}/collections/${collectionId}`)).data;
  }

  async createCollectionForm(payload) {
    return (await api.post(`${this.path}`, payload)).data;
  }
}

export default new CollectionFormService();
