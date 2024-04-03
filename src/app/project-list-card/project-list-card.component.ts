import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'project-list-card',
  templateUrl: './project-list-card.component.html',
  styleUrls: ['./project-list-card.component.css'],
})
export class ProjectListCardComponent {
  projectList: any = [];
  @Input() id: string = '';
  randomColor: string = '#000000';

  constructor(private router: Router, private userService: AppService) {}

  ngOnChanges() {
    this.userService.getUserProjects(this.id).subscribe((projects) => {
      this.projectList = projects;
    });
    this.getRandomColor();
  }

  navigateToProject(projectId: string) {
    this.router.navigateByUrl(`/home/project/${projectId}`);
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    this.randomColor = color;
    return this.randomColor;
  }
}
