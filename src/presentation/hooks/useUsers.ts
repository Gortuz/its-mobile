import { useQuery } from '@tanstack/react-query';
import { getAllUsersUseCase } from '@src/core/di/dependencies';
import type { User } from '@src/domain/entities/User';

/**
 * Presentation hook for fetching all users.
 *
 * - Delegates execution to the use-case (domain layer).
 * - Caches results via React Query (stale time: 60 s).
 * - Returns loading, error and data states.
 */
export function useUsers() {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: () => getAllUsersUseCase.execute(),
    staleTime: 60_000,
  });
}
