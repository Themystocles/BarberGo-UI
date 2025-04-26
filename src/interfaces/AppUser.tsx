export interface IAppUser {
    id: number;
    name: string;
    email: string;
    phone?: string;
    passwordHash?: string;
    googleId?: string;
    profilePictureUrl?: string;
    createdAt: string;

}


