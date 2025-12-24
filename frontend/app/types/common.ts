import type { User } from "./user";

export interface Sort {
    label: string
    key: string
    direction: string
}

export interface Audit {
    event: string;
    old_value: object;
    new_value: object;
    created_at: string;
    user: User;
}