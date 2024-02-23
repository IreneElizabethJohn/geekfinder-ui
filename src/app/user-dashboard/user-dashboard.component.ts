import { Component } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent {
  constructor(private appService: AppService) {}
  userId: string = '';
  posts: any = [];
  liked: any = [];
  showComment: any = [];
  showRequests: any = [];
  isClicked: any = [];
  ngOnInit() {
    this.appService
      .getFeed(localStorage.getItem('id')!)
      .subscribe((resp: any) => {
        this.posts = resp.relevantPosts;
      });
  }
}
