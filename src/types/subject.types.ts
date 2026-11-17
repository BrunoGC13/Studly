import {IUser} from "./user.types";

export interface ISubject {
    id: number,
    name: string,
    color: string,
    owner: IUser
}