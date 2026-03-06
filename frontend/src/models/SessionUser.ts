export interface SessionUser {
    email?: string;
    exp?: number;
    iat?: number;
    [key: string]: any;
}