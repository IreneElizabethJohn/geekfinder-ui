export interface LoginResponse {
  accessToken: string;
  avatarUrl: string;
  userId: string;
}

export interface SignUpPayload {
  email: string;
  displayName: string;
  password: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface UserDetails {
  _id: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  experience: Experience[];
  education: Education[];
  following: [];
  followers: [];
  userType?: string;
}
export interface Following {
  _id: string;
  avatarUrl: string;
  displayName: string;
}
export interface Experience {
  title: string;
  companyName?: string;
  fromDate: string;
  toDate: string;
}

export interface Education {
  title: string;
  instituteName?: string;
  fromDate: string;
  toDate: string;
}
