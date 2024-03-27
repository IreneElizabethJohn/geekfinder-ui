import { Component } from '@angular/core';
import { AppService } from '../app.service';
import { Education, Experience, UserDetails } from '../models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  visibleBioPopup: boolean = false;
  visibleEduExpPopup: boolean = false;
  bioText: string = '';
  companyName: string = '';
  expStartDate: string = '';
  expEndDate: string = '';
  designation: string = '';
  displayProfileName: string = '';
  displayBio: string = '';
  avLink: string = '';
  userType: string = '';
  isEdit: boolean = false;
  isFollow: boolean = false;
  type: string = '';
  editedIndex: number = 0;
  action: string = '';
  followerCount: number = 0;
  followingCount: number = 0;
  follow_label: string = 'Follow';
  userId: string = '';

  userData!: UserDetails;
  finalPayload!: Object;
  eduEvents: Education[] = [];
  expEvents: Experience[] = [];

  random_images: any = ['0', '1'];
  randomImg: any;

  clickFollow: boolean = false;
  clickFollowing: boolean = false;
  followerList = [];
  followingList = [];
  chosenList = [];
  posts = [];
  displayPosts = true;
  isDisabledonFollowing: boolean = false;
  linkedIn: any = '';
  github: any = '';

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.appService.apiData$.subscribe((data) => {
      this.userType = data.userType!;
      this.chosenList = [];
      this.displayPosts = true;
      this.userId = data.id;
      this.appService.getUserDetails(data.id).subscribe({
        next: (res: any) => {
          this.commonApi(res);
        },
      });
    });
  }
  commonApi(data: UserDetails) {
    this.displayProfileName = data.displayName;
    this.avLink = data.avatarUrl;
    this.displayBio = data.bio;
    this.eduEvents = data.education;
    this.expEvents = data.experience;
    this.followerList = data.followers;
    this.followingList = data.following;
    this.followerCount = data.followers.length;
    this.followingCount = data.following.length;
    this.posts = data.posts;
    this.userData = data;
    this.bioText = this.userData.bio;
    this.github = this.userData.socialLinks?.github;
    this.linkedIn = this.userData.socialLinks?.linkedIn;
    this.randomImg =
      this.random_images[Math.floor(Math.random() * this.random_images.length)];
    if (this.userType == 'signedUser') {
      this.isEdit = true;
      this.isFollow = false;
    } else {
      this.isFollow = true;
      this.isEdit = false;
      const id = localStorage.getItem('id');
      const index = data.followers.findIndex((item: any) => item._id == id);
      if (index != -1) {
        this.follow_label = 'Following';
        this.isDisabledonFollowing = true;
      } else {
        this.follow_label = 'Follow';
        this.isDisabledonFollowing = false;
      }
    }
  }

  editBio(event: MouseEvent) {
    event.stopPropagation();
    this.visibleBioPopup = true;
    this.type = 'BIO';
    this.action = 'EDIT';
  }

  changeBio() {
    this.type = 'BIO';
  }

  isExperience(obj: any): obj is Experience {
    return obj && obj.companyName !== undefined;
  }

  editEduExpSection(
    event: Experience | Education,
    type: string,
    action: string
  ) {
    this.visibleEduExpPopup = true;
    this.designation = event.title as string;
    if (this.isExperience(event)) {
      this.companyName = event.companyName as string;
    } else {
      this.companyName = event.instituteName as string;
    }
    this.expStartDate = event.fromDate as string;
    this.expEndDate = event.toDate as string;
    this.type = type;
    this.editedIndex =
      this.type == 'EDU'
        ? this.eduEvents.indexOf(event)
        : this.expEvents.indexOf(event);
    this.action = action;
  }

  addEduExp(type: string, action: string, event: MouseEvent) {
    event.stopPropagation();
    this.visibleEduExpPopup = true;
    this.type = type;
    this.designation = '';
    this.companyName = '';
    this.expStartDate = '';
    this.expEndDate = '';
    this.action = action;
  }

  onSave() {
    if (this.action == 'ADD') {
      if (this.type == 'EDU') {
        this.eduEvents[this.eduEvents.length] = {
          title: this.designation,
          instituteName: this.companyName,
          fromDate: this.expStartDate,
          toDate: this.expEndDate,
        };
        this.finalPayload = {
          education: this.eduEvents,
        };
      }
      if (this.type == 'EXP') {
        this.expEvents[this.expEvents.length] = {
          title: this.designation,
          companyName: this.companyName,
          fromDate: this.expStartDate,
          toDate: this.expEndDate,
        };
        this.finalPayload = {
          experience: this.expEvents,
        };
      }
    }
    if (this.action == 'EDIT') {
      if (this.type == 'BIO') {
        this.finalPayload = {
          bio: this.bioText,
          socialLinks: { github: this.github, linkedIn: this.linkedIn },
        };
      }
      if (this.type == 'EDU') {
        this.eduEvents[this.editedIndex] = {
          title: this.designation,
          instituteName: this.companyName,
          fromDate: this.expStartDate,
          toDate: this.expEndDate,
        };
        this.finalPayload = {
          education: this.eduEvents,
        };
      }

      if (this.type == 'EXP') {
        this.expEvents[this.editedIndex] = {
          title: this.designation,
          companyName: this.companyName,
          fromDate: this.expStartDate,
          toDate: this.expEndDate,
        };
        this.finalPayload = {
          experience: this.expEvents,
        };
      }
    }

    this.appService
      .updateUserDetails(localStorage.getItem('id')!, this.finalPayload)
      .subscribe((data: UserDetails) => {
        this.displayBio = data.bio;
        this.eduEvents = data.education;
        this.expEvents = data.experience;
      });
    this.visibleBioPopup = false;
    this.visibleEduExpPopup = false;
  }

  onDelete() {
    if (this.type == 'EDU') {
      this.eduEvents.splice(this.editedIndex, 1);
      this.finalPayload = {
        education: this.eduEvents,
      };
    }
    if (this.type == 'EXP') {
      this.expEvents.splice(this.editedIndex, 1);
      this.finalPayload = {
        experience: this.expEvents,
      };
    }
    this.appService
      .updateUserDetails(localStorage.getItem('id')!, this.finalPayload)
      .subscribe((data: UserDetails) => {
        this.displayBio = data.bio;
        this.github = data.socialLinks?.github;
        this.linkedIn = data.socialLinks?.linkedIn;
        this.eduEvents = data.education;
        this.expEvents = data.experience;
      });
    this.visibleEduExpPopup = false;
  }

  onFollow() {
    this.follow_label = 'Following';
    const payload = { followeeId: this.userData._id };
    this.appService.addFollowing(payload).subscribe(() => {
      this.appService
        .getUserDetails(this.userData._id)
        .subscribe((data: UserDetails) => {
          this.commonApi(data);
        });
    });
  }

  navigateToWebsite(url: string) {
    window.open(url, '_blank');
  }
}
