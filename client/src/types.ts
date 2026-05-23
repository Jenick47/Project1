export interface User {
  id: number;
  name: string;
  age: number;
  bio: string;
  photoUrl: string;
  email: string;
}

export interface Candidate {
  id: number;
  name: string;
  age: number;
  bio: string;
  photoUrl: string;
}

export interface Match {
  matchId: number;
  createdAt: string;
  partner: {
    id: number;
    name: string;
    age: number;
    photoUrl: string;
  };
}
