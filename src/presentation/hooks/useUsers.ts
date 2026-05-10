import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllUsersUseCase, 
  createUserUseCase, 
  updateUserUseCase, 
  deleteUserUseCase 
} from '@src/core/di/dependencies';
import type { User } from '@src/domain/entities/User';

/**
 * Presentation hook for fetching all users.
 */
export function useUsers() {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: () => getAllUsersUseCase.execute(),
    staleTime: 60_000,
  });
}

/**
 * Hook for creating a user.
 */
export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (user: Omit<User, 'id'>) => createUserUseCase.execute(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

/**
 * Hook for updating a user.
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, user }: { id: string; user: Partial<Omit<User, 'id'>> }) => 
      updateUserUseCase.execute(id, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

/**
 * Hook for deleting a user.
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteUserUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
