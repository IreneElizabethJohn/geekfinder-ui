import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ProjectComponent } from './project/project.component';
import { ProfileComponent } from './profile/profile.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: 'login', component: SignInComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: UserDashboardComponent },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      { path: 'project/:id', component: ProjectComponent },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
