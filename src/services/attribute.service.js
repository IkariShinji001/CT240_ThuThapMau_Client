import api from "./api.service";
class AttributeService {
  constructor() {
    this.path = "/api/v1/collection-attributes";
  }

  async getAttributesByCollectionFormId(collectionFormId){
    return (await api.get(`${this.path}/${collectionFormId}`)).data
  }
}

export default new AttributeService();