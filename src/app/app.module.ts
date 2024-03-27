import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectComponent } from './project/project.component';
import { ProfileComponent } from './profile/profile.component';

import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { MenuModule } from 'primeng/menu';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { SplitterModule } from 'primeng/splitter';
import { AccordionModule } from 'primeng/accordion';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { TimelineModule } from 'primeng/timeline';
import { AuthInterceptor } from './auth/auth.interceptor';
import { ListboxModule } from 'primeng/listbox';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToastModule } from 'primeng/toast';
import { DataViewModule } from 'primeng/dataview';
import { FileUploadModule } from 'primeng/fileupload';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TimeAgoPipe } from 'src/utils/timeAgo.pipe';
import { PostComponent } from './post/post.component';
import { ProjectListCardComponent } from './project-list-card/project-list-card.component';
import { TabViewModule } from 'primeng/tabview';
import { DragDropModule } from 'primeng/dragdrop';
import { TagModule } from 'primeng/tag';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    SignInComponent,
    ProjectComponent,
    ProfileComponent,
    UserDashboardComponent,
    TimeAgoPipe,
    PostComponent,
    ProjectListCardComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ButtonModule,
    HttpClientModule,
    FormsModule,
    PasswordModule,
    DividerModule,
    InputTextModule,
    AvatarGroupModule,
    AvatarModule,
    MenuModule,
    SplitterModule,
    AccordionModule,
    DialogModule,
    InputTextareaModule,
    CalendarModule,
    CardModule,
    DropdownModule,
    TimelineModule,
    ListboxModule,
    AutoCompleteModule,
    ToastModule,
    DataViewModule,
    FileUploadModule,
    SelectButtonModule,
    TabViewModule,
    DragDropModule,
    TagModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
