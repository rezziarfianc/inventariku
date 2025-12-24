import type { Product } from "./product";

export interface SupplyFlow {
    supply_flow_id: string;
    id?: string; // For useResource compatibility
    name?: string; // For useResource compatibility
    product_id: string;
    product: Product;
    flow_type: 'inbound' | 'outbound';
    quantity: number;
    created_at: string;
    latest_audit?: Audit;
}

export interface AuditUser {
    user_id: string;
    name: string;
    email: string;
}

export interface Audit {
    audit_id: string;
    user_id: string;
    event: string;
    created_at: string;
    user?: AuditUser;
}
export interface PaginatedSupply {
    supplies: SupplyFlow[];
    total: number;
    perPage: number;
    lastPage: number;
}