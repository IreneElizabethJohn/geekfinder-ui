import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from './project.service';
import { TabView } from 'primeng/tabview';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
})
export class ProjectComponent {
  teamList: any = [];
  projectDetails: any;
  openEditModal: boolean = false;
  openDeleteModal: boolean = false;
  roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'Collabrator', value: 'collaborator' },
  ];
  chosenRole = '';
  descriptionText: string = '';
  userRole: string = '';
  @ViewChild('dv') dv!: TabView;
  openTaskModal: boolean = false;
  column1Items: any[] = [];
  column2Items: any[] = [];
  column3Items: any[] = [];
  column4Items: any[] = [];
  draggedItem: any;
  types = [
    { label: 'Development', value: 'Development' },
    { label: 'QA', value: 'QA' },
    { label: 'Documentation', value: 'Documentation' },
  ];
  status = [
    { label: 'TODO', value: 'TODO' },
    { label: 'IN PROGRESS', value: 'IN_PROGRESS' },
    { label: 'COMPLETED', value: 'COMPLETED' },
    { label: 'TESTING', value: 'TESTING' },
  ];
  assignee: any;
  action: string = '';
  taskId: string = '';
  displayName: string = '';
  changeStatus: any;
  taskCreator: any;
  taskTitle = '';
  taskDescription = '';
  taskStatus = '';
  taskType = '';
  projectName: string = '';
  disableDelete = true;

  openModal(action: string, item?: any) {
    this.openTaskModal = true;
    this.action = action;
    if (action == 'ADD') {
      this.taskTitle = '';
      this.taskDescription = '';
      this.taskStatus = '';
      this.taskType = '';
    } else {
      this.taskTitle = item.title;
      this.taskDescription = item.description;
      this.taskStatus = item.status;
      this.taskType = item.type;
      this.taskId = item._id;
      this.displayName = item.displayName;
      this.assignee = this.teamList.find((x: any) => {
        return item.assignee.displayName == x.user.displayName;
      });
    }
  }

  onDragStart(event: any, item: any, fromColumn: string) {
    this.draggedItem = { item: item, from: fromColumn };
  }

  onDrop(event: any, targetColumn: string) {
    const draggedItem = this.draggedItem.item;
    const sourceColumn = this.draggedItem.from;

    if (sourceColumn === 'column1') {
      this.column1Items.splice(this.column1Items.indexOf(draggedItem), 1);
    } else if (sourceColumn === 'column2') {
      this.column2Items.splice(this.column2Items.indexOf(draggedItem), 1);
    } else if (sourceColumn === 'column3') {
      this.column3Items.splice(this.column3Items.indexOf(draggedItem), 1);
    } else if (sourceColumn === 'column4') {
      this.column4Items.splice(this.column4Items.indexOf(draggedItem), 1);
    }

    if (targetColumn === 'column1') {
      this.column1Items.push(draggedItem);
      this.changeStatus = { status: 'TODO' };
    } else if (targetColumn === 'column2') {
      this.column2Items.push(draggedItem);
      this.changeStatus = { status: 'IN_PROGRESS' };
    } else if (targetColumn === 'column3') {
      this.column3Items.push(draggedItem);
      this.changeStatus = { status: 'TESTING' };
    } else if (targetColumn === 'column4') {
      this.column4Items.push(draggedItem);
      this.changeStatus = { status: 'COMPLETED' };
    }

    this.projectService
      .patchTask(this.changeStatus, draggedItem._id)
      .subscribe((x) => {});
  }

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit() {
    this.projectService
      .getProjectDetails(this.route.snapshot.params['id'])
      .subscribe((details) => {
        this.projectDetails = details;
        this.teamList = this.projectDetails.collaborators;
        const userRole = this.projectDetails.collaborators.filter(
          (c: any) => c.user._id == localStorage.getItem('id')
        );
        this.userRole = userRole[0]?.role;
        this.taskCreator = userRole[0].user.displayName;
      });
  }

  onSave() {
    const payload = {
      description: this.descriptionText,
    };
    this.projectService
      .patchProjectDetails(payload, this.route.snapshot.params['id'])
      .subscribe((res: any) => {
        this.projectDetails.description = res.description;
      });
    this.openEditModal = false;
    this.descriptionText = '';
  }

  deleteProject() {
    const payload = {
      projectName: this.projectDetails.title,
      ownerId: this.projectDetails.owner,
    };

    this.projectService.removeProject(payload).subscribe((res) => {
      this.openDeleteModal = false;
      this.router.navigateByUrl('/home/dashboard');
    });
  }

  onRoleChange(projectId: string, collaboratorId: string, event: any) {
    const payload = { role: event.value };
    this.projectService
      .changeCollaboratorRole(projectId, collaboratorId, payload)
      .subscribe((resp) => {});
  }
  removeCollaborator(projectId: string, collaboratorId: string) {
    this.projectService
      .removeCollaborator(projectId, collaboratorId)
      .subscribe((res) => {
        this.ngOnInit();
      });
  }

  onTaskSave() {
    if (this.action == 'ADD') {
      const payload = {
        owner: localStorage.getItem('id'),
        title: this.taskTitle,
        description: this.taskDescription,
        status: this.taskStatus,
        assignee: this.assignee.user._id,
        type: this.taskType,
      };
      this.projectService
        .createTask(payload, this.route.snapshot.params['id'])
        .subscribe((x) => {
          this.getItems();
        });
    }
    if (this.action == 'EDIT') {
      const payload = {
        owner: localStorage.getItem('id'),
        title: this.taskTitle,
        description: this.taskDescription,
        status: this.taskStatus,
        assignee: this.assignee.user._id,
        type: this.taskType,
      };
      this.projectService.patchTask(payload, this.taskId).subscribe((resp) => {
        this.getItems();
      });
    }
    this.openTaskModal = false;
  }

  onTabChange(event: any) {
    if (event.index === 2) {
      this.getItems();
    }
  }

  deleteTask() {
    this.projectService.deleteTask(this.taskId).subscribe((x) => {});
    this.openTaskModal = false;
    this.getItems();
  }

  getItems() {
    this.projectService
      .getTask(this.route.snapshot.params['id'])
      .subscribe((response: any) => {
        this.column1Items = response.filter(
          (item: any) => item.status == 'TODO'
        );
        this.column2Items = response.filter(
          (item: any) => item.status == 'IN_PROGRESS'
        );
        this.column3Items = response.filter(
          (item: any) => item.status == 'TESTING'
        );
        this.column4Items = response.filter(
          (item: any) => item.status == 'COMPLETED'
        );
      });
  }

  enableProjectDelete() {
    if (this.projectDetails?.title === this.projectName) {
      this.disableDelete = false;
    } else {
      this.disableDelete = true;
    }
  }
}
