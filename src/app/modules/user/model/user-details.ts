class Specific {
}

export interface UserDetailsDTO {
  id: number;
  email: string;
  userName: string;
  photoUrl: string;
  enabled: boolean;
  credentialsNonExpired: boolean;
  accountNonExpired: boolean;
  locked: boolean;
  birthdate: string; // ISO 8601 date-time format
  createDate: string; // ISO 8601 date-time format
  specifics: Specific[];
}
