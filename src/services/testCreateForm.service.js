import api from "./api.service";
class testValue {
  constructor() {
    this.path = "/api/v1/collection-values";
  }

  async createValue(values) {
    const formData = new FormData();
    for (const key in values) {
      formData.append(key, values[key]);
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

export default new testValue();
