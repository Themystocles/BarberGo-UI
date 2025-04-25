export interface IAppUser {
    Id: number;
    name: string;
    email: string;
    phone?: string;
    passwordHash?: string;
    googleId?: string;
    profilePictureUrl?: string;
    createdAt: string;

}


