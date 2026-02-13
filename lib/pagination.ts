import { PaginatedResult, PaginationParams } from "@/types/pagination";
export type { PaginationParams };

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

export function getPaginationParams(params?: PaginationParams) {
    const page = Math.max(1, Number(params?.page) || 1);
    const pageSize = Math.min(
        MAX_PAGE_SIZE,
        Math.max(1, Number(params?.pageSize) || DEFAULT_PAGE_SIZE)
    );

    return {
        page,
        pageSize,
        skip: (page - 1) * pageSize,
        take: pageSize,
    };
}

export function createPaginatedResult<T>(
    data: T[],
    total: number,
    page: number,
    pageSize: number
): PaginatedResult<T> {
    return {
        data,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    };
}

// Alias for backward compatibility or preference
export type PaginatedResponse<T> = PaginatedResult<T>;

export function buildMeta(total: number, page: number, limit: number) {
    return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
}
