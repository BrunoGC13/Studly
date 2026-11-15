/**
 * Interface representing a User in PostgreSQL.
 */
export interface IUser {
    id: number;
    name: string;
    email: string;
    password: string; // hashed password
    isverified: boolean;
    resetpasswordtoken?: string | null;
    resetpasswordexpires?: Date | null;
    verificationtoken?: string | null;
    verificationtokenexpires?: Date | null;
    createdat: Date;
    updatedat: Date;
}

/**
 * Interface representing the input required to create/register a new user.
 */
export interface IUserInput {
    name: string;
    email: string;
    password: string;
}
