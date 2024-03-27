import { Component } from '@angular/core';
import { PostService } from '../post/post.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent {
  constructor(private postService: PostService) {}
  userId: string = localStorage.getItem('id')!;
  posts: any = [];
  liked: any = [];
  showComment: any = [];
  showRequests: any = [];
  isClicked: any = [];
  articles: any = [];
  ngOnInit() {
    this.postService.getFeed(this.userId).subscribe((resp: any) => {
      this.posts = resp.relevantPosts;
    });
    this.postService.getLatestTechNews().subscribe((news) => {
      this.articles = news.articles;
    });
  }
}
