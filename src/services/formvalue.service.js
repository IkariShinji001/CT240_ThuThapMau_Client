import api from "./api.service";

class FormValueService{
    constructor(){
        this.path = "/api/v1/collection-values"
    }
    
    async getAllFormValue(colletionFormId) {
        return (await api.get(`${this.path}/${colletionFormId}`)).data
    }

}

export default new FormValueService()