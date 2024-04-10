import api from "./api.service";
class ProjectMemberService {
  constructor() {
    this.path = "/api/v1/project-member";
  }

  async getProjectMember(projectId, accept_status) {
    return (
      await api.get(`${this.path}/projects/${projectId}`, {
        params: { accept_status },
      })
    ).data;
  }

  async removeProjectMember(memberId, projectId) {
    return (
      await api.delete(`${this.path}/projects/${projectId}/users/${memberId}`)
    ).data;
  }

  async addMembersToProject(user_ids, projectId) {
    return (await api.post(`${this.path}/projects/${projectId}`, user_ids))
      .data;
  }

  async addOwnerToProjectMember(userId, projectId) {
    return (await api.post(`${this.path}/owner-projects/${projectId}`, userId))
      .data;
  }
  async updateMemberStatus(body) {
    return (await api.patch(`${this.path}`, body)).data;
  }

  async requestToJoinProject(userId, inviteCode) {
    return (
      await api.get(
        `${this.path}/users/${userId}/request-join-to-project/${inviteCode}`
      )
    ).data;
  }

  async getNotificationRequest(userId){
    return (await api.get(`${this.path}/users/${userId}/notification/request`)).data;
  }

}

export default new ProjectMemberService();
