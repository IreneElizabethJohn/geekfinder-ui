import { Component, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { UserDetails } from '../models/user.model';
import { FileUpload } from 'primeng/fileupload';
import { HttpHeaders } from '@angular/common/http';
import { PostService } from '../post/post.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  avatarLink!: string;
  searchKeyword: string = '';
  isMenuVisible: boolean = false;
  menuItems: MenuItem[] = [];

  searchResults: UserDetails | any = [];
  loggedUserData!: UserDetails;

  openPostModal: boolean = false;
  chosenType = 'off';
  postDescription = '';
  key: string = '';
  @ViewChild('fileInput') fileInput!: FileUpload;
  typeOptions = [
    { label: 'Normal', value: 'off' },
    { label: 'Project', value: 'on' },
  ];
  constructor(
    private appService: AppService,
    private router: Router,
    private postService: PostService
  ) {}

  ngOnInit() {
    const userId = localStorage.getItem('id');
    this.appService.setData(userId, 'signedUser');
    const link = localStorage.getItem('avatarUrl');
    this.avatarLink = link!;
    this.menuItems = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => {
          this.appService.setData(userId, 'signedUser');
          this.isMenuVisible = false;
          this.router.navigateByUrl('/home/profile');
        },
      },
      {
        label: 'Logout',
        icon: 'pi pi-power-off',
        command: () => {
          this.router.navigateByUrl('/login');
          localStorage.removeItem('token');
        },
      },
    ];
  }

  search() {
    if (this.searchKeyword != '') {
      this.appService.commonSearch(this.searchKeyword).subscribe((response) => {
        this.searchResults = response;
      });
    } else {
      this.searchResults = [];
    }
  }

  showMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

  callSearchProfile(item: any) {
    this.searchKeyword = item.displayName;
    item.userType = 'searchUser';
    this.appService.setData(item._id, 'searchUser');
    this.router.navigateByUrl('/home');
    this.router.navigateByUrl('/home/profile');
  }

  onFileSelect(event: any) {
    const file = this.fileInput._files[0];
    this.postService.getSignedUrl(file.name, file.type).subscribe((res) => {
      const blob = new Blob([file], { type: file.type });
      this.key = res.key;
      const headers = new HttpHeaders({
        'Content-Type': file.type,
        'Content-Disposition': `attachment; filename="${file.name}"`,
      });
      this.postService
        .uploadImage(res.presignedPUTURL, blob, headers)
        .subscribe((res) => {
          this.fileInput.progress = 100;
        });
    });
  }

  onSubmit() {
    const payload: any = {
      ownerId: localStorage.getItem('id'),
      content: this.postDescription,
      type: this.chosenType == 'off' ? 'N' : 'P',
    };
    if (this.fileInput._files.length > 0) {
      payload.key = this.key;
    }
    this.postService.createPost(payload).subscribe(() => {
      this.openPostModal = false;
      this.appService.setData(localStorage.getItem('id'), 'signedUser');
      this.router.navigateByUrl('/home');
      this.router.navigateByUrl('/home/profile');
    });
  }

  addPost() {
    this.openPostModal = true;
    this.postDescription = '';
    this.chosenType = 'off';
    this.fileInput.clear();
  }
}
