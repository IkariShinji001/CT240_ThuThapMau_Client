import api from "./api.service";
class UserService {
  constructor() {
    this.path = "/public";
    this.userPath = "/api/v1/users";
  }

  async login(user) {
    const data = (await api.post(`${this.path}/login`, user)).data;
    return data;
  }
  async signup(user) {
    return (await api.post(`${this.userPath}`, user)).data;
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
    await api.post(`${this.path}/forget-password`, { email });
  }

  async sendmail(user_email) {
    await api.post(`${this.userPath}/sendEmail/forget-password`, user_email);
  }

  async sendmail(user_email) {
    await api.post(`${this.userPath}/sendEmail/forget-password`, user_email);
  }

  async resetPassword(user_id, password) {
    console.log(user_id, password);
    await api.patch(`${this.userPath}/reset-password?user_id=${ user_id }`, password);
  }

  async getUserId(id) {
    return (await api.get(`${this.userPath}/${id}`)).data;
  }

  async update(id, data) {
    return (await api.patch(`${this.userPath}/${id}`, data)).data;
  }

  async getUserByEmail(email) {
    return (await api.get(`${this.userPath}/emails/${email}`)).data;
  }

  async updateUserImage(user_id, image) {
    const formData = new FormData();
    formData.append("file", image);
    return (
      await api.patch(`${this.userPath}/${user_id}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data;
  }
}

export default new UserService();
