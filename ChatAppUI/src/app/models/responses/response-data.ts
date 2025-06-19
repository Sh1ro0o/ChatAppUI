export interface ResponseData<T = undefined> {
    isSuccessful: boolean;
    data?: T;
    errorMessage?: string;
}