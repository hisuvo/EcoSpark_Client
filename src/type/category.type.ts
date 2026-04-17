export interface ICategory {
    id: string;
    name: string;
    description?: string | null | undefined;
    createdAt: string;
    updatedAt: string;
}

export interface ICategoryCreatePayload {
    name: string;
    description?: string | null | undefined;
}

export interface ICategoryUpdatePayload {
    name?: string;
    description?: string | null | undefined;
}