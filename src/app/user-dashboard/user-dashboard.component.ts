import { Component } from '@angular/core';
import { PostService } from '../post/post.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent {
  constructor(private postService: PostService) {}
  userId: string = '';
  posts: any = [];
  liked: any = [];
  showComment: any = [];
  showRequests: any = [];
  isClicked: any = [];
  ngOnInit() {
    this.postService
      .getFeed(localStorage.getItem('id')!)
      .subscribe((resp: any) => {
        this.posts = resp.relevantPosts;
      });
  }
}
