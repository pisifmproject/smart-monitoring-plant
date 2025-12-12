export interface LoginDto {
    username: string;
    password: string;
}

export interface UserResponseDto {
    id: number;
    username: string;
    role: string;
    full_name: string | null;
}
