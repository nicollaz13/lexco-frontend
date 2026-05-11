export interface Product {
    id?: number;
    name: string;
    description?: string;
    image?: string;
    price: number;
    stock: number;
    created_at?: Date;
    updated_at?: Date;
}