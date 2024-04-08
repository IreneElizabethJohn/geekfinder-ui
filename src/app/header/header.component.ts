import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { UserDetails } from '../models/user.model';
import { FileUpload } from 'primeng/fileupload';
import { HttpHeaders } from '@angular/common/http';
import { PostService } from '../post/post.service';
import { Menu } from 'primeng/menu';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

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
  @ViewChild('menu') menu!: Menu;
  projectName: string = '';
  conflictMsg = '';
  isHandset: any;
  display = false;

  constructor(
    private appService: AppService,
    private router: Router,
    private postService: PostService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
      .subscribe((result: any) => {
        this.isHandset = result.matches;
      });
  }

  ngOnInit() {
    const userId = localStorage.getItem('id');
    this.appService.setData(userId, 'signedUser');
    const link = localStorage.getItem('avatarUrl');
    this.avatarLink = link!;
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

  showMenu(event: any) {
    this.display = !this.display;
    // event.stopPropagation();
  }
  onProfileClick() {
    this.appService.setData(localStorage.getItem('id'), 'signedUser');
    this.display = false;
    this.router.navigateByUrl('/home/profile');
  }
  onLogOutClick() {
    this.router.navigateByUrl('/login');
    localStorage.removeItem('token');
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
    let payload: any;
    if (this.chosenType == 'off' && this.projectName.length == 0) {
      payload = {
        ownerId: localStorage.getItem('id'),
        content: this.postDescription,
        type: 'N',
      };
    }
    if (this.chosenType == 'on' && this.projectName.length > 0) {
      payload = {
        ownerId: localStorage.getItem('id'),
        content: this.postDescription,
        type: 'P',
        projectName: this.projectName,
      };
    }
    if (this.fileInput._files.length > 0) {
      payload.key = this.key;
    }
    this.postService.createPost(payload).subscribe({
      next: () => {
        this.openPostModal = false;
        this.appService.setData(localStorage.getItem('id'), 'signedUser');
        this.router.navigateByUrl('/home');
        this.router.navigateByUrl('/home/profile');
      },
      error: (err) => {
        if (err.error.error == 'Conflict') {
          this.conflictMsg = err.error.message;
        }
      },
    });
  }

  addPost() {
    this.openPostModal = true;
    this.postDescription = '';
    this.chosenType = 'off';
    this.fileInput.clear();
    this.projectName = '';
    this.conflictMsg = '';
  }

  @HostListener('document:scroll', ['$event'])
  onScroll(event: Event) {
    this.isMenuVisible = false;
  }

  //if we need to remove p-menu on click
  // @HostListener('document:click', ['$event'])
  // onClick(event: MouseEvent) {
  //   console.log('event target', event.target);
  //   console.log('meny native elemnt', this.menu);
  //   if (!this.menu.el.nativeElement.contains(event.target)) {
  //     this.isMenuVisible = false;
  //   }
  // }
}
