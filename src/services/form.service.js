import api from "./api.service";

class FormService{
    constructor(){
        this.path = "/api/v1/collection-forms"
    }
    
    async getCollectionFormById(collectionFormId) {
        return (await api.get(`${this.path}/${collectionFormId}`)).data
    }

}

export default new FormService()