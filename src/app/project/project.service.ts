import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.local';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private http: HttpClient) {}

  addCollaborator(payload: any) {
    const url = environment.apiUrl + `projects/collaborator`;
    return this.http.post(url, payload);
  }

  removeCollaborator(projectId: string, collaboratorId: string) {
    const url =
      environment.apiUrl +
      `projects/${projectId}/collaborators/${collaboratorId}`;
    return this.http.delete(url);
  }

  removeProject(payload: any) {
    const url = environment.apiUrl + `projects`;
    return this.http.delete(url, { body: payload });
  }

  getProjectDetails(projectId: string) {
    const url = environment.apiUrl + `projects/${projectId}`;
    return this.http.get(url);
  }

  patchProjectDetails(payload: any, projectId: string) {
    const url = environment.apiUrl + `projects/${projectId}`;
    return this.http.patch(url, payload);
  }

  changeCollaboratorRole(
    projectId: string,
    collaboratorId: string,
    payload: any
  ) {
    const url =
      environment.apiUrl +
      `projects/${projectId}/collaborators/${collaboratorId}/role`;
    return this.http.put(url, payload);
  }

  createTask(payload: any, projectId: string) {
    const url = environment.apiUrl + `tasks/${projectId}`;
    return this.http.post(url, payload);
  }

  patchTask(payload: any, taskId: string) {
    const url = environment.apiUrl + `tasks/${taskId}`;
    return this.http.patch(url, payload);
  }

  deleteTask(taskId: string) {
    const url = environment.apiUrl + `tasks/${taskId}`;
    return this.http.delete(url);
  }

  getTask(projectId: string) {
    const url = environment.apiUrl + `tasks/${projectId}`;
    return this.http.get(url);
  }
}
