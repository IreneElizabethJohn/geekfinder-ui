import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService } from 'src/environments/environment.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  private apiUrl = this.environmentService.getApiUrl();

  addCollaborator(payload: any) {
    const url = this.apiUrl + `projects/collaborator`;
    return this.http.post(url, payload);
  }

  removeCollaborator(projectId: string, collaboratorId: string) {
    const url =
      this.apiUrl + `projects/${projectId}/collaborators/${collaboratorId}`;
    return this.http.delete(url);
  }

  removeProject(payload: any) {
    const url = this.apiUrl + `projects`;
    return this.http.delete(url, { body: payload });
  }

  getProjectDetails(projectId: string) {
    const url = this.apiUrl + `projects/${projectId}`;
    return this.http.get(url);
  }

  patchProjectDetails(payload: any, projectId: string) {
    const url = this.apiUrl + `projects/${projectId}`;
    return this.http.patch(url, payload);
  }

  changeCollaboratorRole(
    projectId: string,
    collaboratorId: string,
    payload: any
  ) {
    const url =
      this.apiUrl +
      `projects/${projectId}/collaborators/${collaboratorId}/role`;
    return this.http.put(url, payload);
  }

  createTask(payload: any, projectId: string) {
    const url = this.apiUrl + `tasks/${projectId}`;
    return this.http.post(url, payload);
  }

  patchTask(payload: any, taskId: string) {
    const url = this.apiUrl + `tasks/${taskId}`;
    return this.http.patch(url, payload);
  }

  deleteTask(taskId: string) {
    const url = this.apiUrl + `tasks/${taskId}`;
    return this.http.delete(url);
  }

  getTask(projectId: string) {
    const url = this.apiUrl + `tasks/${projectId}`;
    return this.http.get(url);
  }
}
