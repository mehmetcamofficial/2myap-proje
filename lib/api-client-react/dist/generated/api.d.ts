import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { Error, HealthStatus, QuoteRequest, QuoteRequestInput } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: Parameters<typeof customFetch>[1]) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateQuoteRequestUrl: () => string;
/**
 * Creates a lead from the website quote form.
 * @summary Submit a quote request
 */
export declare const createQuoteRequest: (quoteRequestInput: QuoteRequestInput, options?: Parameters<typeof customFetch>[1]) => Promise<QuoteRequest>;
export declare const getCreateQuoteRequestMutationOptions: <TError = ErrorType<Error>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createQuoteRequest>>, TError, {
        data: BodyType<QuoteRequestInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createQuoteRequest>>, TError, {
    data: BodyType<QuoteRequestInput>;
}, TContext>;
export type CreateQuoteRequestMutationResult = NonNullable<Awaited<ReturnType<typeof createQuoteRequest>>>;
export type CreateQuoteRequestMutationBody = BodyType<QuoteRequestInput>;
export type CreateQuoteRequestMutationError = ErrorType<Error>;
/**
* @summary Submit a quote request
*/
export declare const useCreateQuoteRequest: <TError = ErrorType<Error>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createQuoteRequest>>, TError, {
        data: BodyType<QuoteRequestInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createQuoteRequest>>, TError, {
    data: BodyType<QuoteRequestInput>;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map