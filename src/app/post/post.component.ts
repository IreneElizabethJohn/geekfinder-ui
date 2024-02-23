import { Component, Input, OnChanges } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnChanges {
  showComment: any = [];
  commentText: string = '';
  comments: any = [];
  showRequests: any = [];
  liked: any = [];
  @Input() inputData: any;
  userType: any;
  constructor(private appService: AppService, private router: Router) {}
  ngOnChanges() {
    this.inputData.forEach((post: any, i: number) => {
      const typeIndex = post.ownerId._id == localStorage.getItem('id');
      if (typeIndex) {
        this.userType = 'signedUser';
      } else {
        this.userType = 'searchUser';
      }
      const index = post.likes.findIndex(
        (like: string) => like == localStorage.getItem('id')
      );
      this.showComment[index] = false;
      this.showRequests[index] = false;
      if (index != -1) {
        this.liked[i] = true;
      } else {
        this.liked[i] = false;
      }
      const requestedIndex = post.joinRequests.findIndex((req: any) =>
        req._id ? req._id : req == localStorage.getItem('id')
      );
      console.log('req index', requestedIndex);
      if (requestedIndex != -1) {
        this.isClicked[i] = true;
      } else {
        this.isClicked[i] = false;
      }
    });
  }
  addLikes(post: any, index: any) {
    this.liked[index] = true;
    const postId = post._id;
    const payload = { userId: localStorage.getItem('id') };
    this.appService.addLikes(payload, postId).subscribe((x) => {
      post.likes.length++;
    });
  }
  addComment(post: any, index: any) {
    const postId = post._id;
    const payload = {
      userId: localStorage.getItem('id'),
      comment: this.commentText,
    };

    this.appService.addComments(payload, postId).subscribe((x) => {
      this.commentText = '';
      post.comments.length++;
      this.getComments(post._id);
    });
  }

  displayComments(index: number, post: any) {
    this.showComment[index] = true;
    console.log('cmmnt index', index);
    this.getComments(post._id);
  }
  displayRequests(index: number) {
    this.showRequests[index] = true;
  }
  getComments(postId: string) {
    this.appService.getComments(postId).subscribe((resp: any) => {
      this.comments = resp.comments;
    });
  }
  isClicked: any = [];
  addJoinRequests(post: any, index: number) {
    const payload = {
      userId: localStorage.getItem('id'),
    };
    this.appService.addJoinRequests(payload, post._id).subscribe((res: any) => {
      this.isClicked[index] = true;
    });
  }

  callSpecificProfile(ownerId: string) {
    this.appService.setData(ownerId, this.userType);
    this.router.navigateByUrl('/home');
    this.router.navigateByUrl('/home/profile');
  }
}
