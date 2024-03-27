import { Component, Input, OnChanges } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { PostService } from './post.service';
import { ProjectService } from '../project/project.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnChanges {
  showComment: any = [];
  commentText: string[] = [];
  comments: any = [];
  showRequests: any = [];
  liked: any = [];
  @Input() inputData: any;
  userType: any;
  @Input() chosenType: any;
  selectedId: string = '';
  changedIndex: number = -1;

  constructor(
    private appService: AppService,
    private router: Router,
    private postService: PostService,
    private projectService: ProjectService
  ) {}
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
    this.postService.addLikes(payload, postId).subscribe((x) => {
      post.likes.length++;
    });
  }
  addComment(post: any, index: any) {
    const postId = post._id;
    const payload = {
      userId: localStorage.getItem('id'),
      comment: this.commentText[index],
    };

    this.postService.addComments(payload, postId).subscribe((x) => {
      this.commentText[index] = '';
      post.comments.length++;
      this.getComments(post._id, index);
    });
  }
  displayComments(index: number, post: any) {
    this.showComment[index] = !this.showComment[index];
    this.showRequests[index] = false;
    this.getComments(post._id, index);
  }
  displayRequests(index: number) {
    this.showRequests[index] = !this.showRequests[index];
    this.showComment[index] = false;
  }
  getComments(postId: string, index: number) {
    this.postService.getComments(postId).subscribe((resp: any) => {
      this.comments[index] = resp.comments;
    });
  }
  isClicked: any = [];
  addJoinRequests(post: any, index: number) {
    const payload = {
      userId: localStorage.getItem('id'),
    };
    this.postService
      .addJoinRequests(payload, post._id)
      .subscribe((res: any) => {
        this.isClicked[index] = true;
      });
  }

  callSpecificProfile(ownerId: string) {
    this.appService.setData(ownerId, this.userType);
    this.router.navigateByUrl('/home');
    this.router.navigateByUrl('/home/profile');
  }

  addCollaborator(
    projectName: string,
    ownerId: string,
    collaboratorId: string,
    index: number
  ) {
    const payload = {
      projectName: projectName,
      ownerId: ownerId,
      collaboratorId: collaboratorId,
    };
    this.projectService.addCollaborator(payload).subscribe((res) => {
      this.removeFromListBox();
      this.showRequests[index] = false;
    });
  }

  removeJoinRequest(postId: string, userId: string, index: number) {
    this.postService.removeJoinRequest(postId, userId).subscribe((res) => {
      this.removeFromListBox();
      this.showRequests[index] = false;
    });
  }

  removeFromListBox() {
    const index = this.inputData[this.changedIndex].joinRequests.findIndex(
      (req: any) => req._id == this.selectedId
    );
    this.inputData[this.changedIndex].joinRequests.splice(index, 1);
  }

  onSelectionChange(event: any, index: number) {
    this.selectedId = event.value._id;
    this.changedIndex = index;
  }
}
