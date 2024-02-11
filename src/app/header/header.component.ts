import { Component, ViewChild, ViewChildren } from '@angular/core';
import { Menu } from 'primeng/menu';
import { AppService } from '../app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { UserDetails } from '../models/user.model';
interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
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
  constructor(private appService: AppService, private router: Router) {}

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

  onUpload(event: UploadEvent) {
    console.log(event);
    // this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
    //getsignedurl api then use that url to do put call to aws(upload) and add post->post call (key pass)
  }
}
