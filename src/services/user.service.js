import api from "./api.service";
class UserService {
  constructor() {
    this.path = "/public";
  }

  async login(user) {
    const data = (await api.post(`${this.path}/login`, user)).data;
    return data;
  }

  async verifyUser() {
    try {
      await api.get(`${this.path}/verify-access-token`);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async forgetPassword(email) {
    await api.post(`${this.path}/forget-password`, {email});
  }

  async resetPassword(user_id, password){
    await api.post(`${this.path}/reset-password`, {user_id, password});
  }

}

export default new UserService();
