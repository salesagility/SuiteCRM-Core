export interface ApiAccessTokenResponseModel {
    accessToken: string;
    expiresIn: number;
    tokenType: string;
    refreshToken: string;
    scope?: string[];
}
