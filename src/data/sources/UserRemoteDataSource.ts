import apiClient from '@src/core/http/apiClient';
import type { ApiResponseDto, UserDto } from '@src/data/mappers/UserMapper';

/**
 * Unwraps the gateway response regardless of shape:
 *   - ApiResponseDto envelope  → { success, data: T, ... }  returns .data
 *   - Raw array / object       → T                           returns as-is
 */
function unwrap<T>(payload: ApiResponseDto<T> | T): T {
  if (
    payload !== null &&
    typeof payload === 'object' &&
    'data' in (payload as object) &&
    'success' in (payload as object)
  ) {
    return (payload as ApiResponseDto<T>).data;
  }
  return payload as T;
}

/**
 * Remote data source — the only layer that knows about HTTP endpoints.
 * Returns raw DTOs; mapping is done at the repository level.
 *
 * Logs the raw gateway response in __DEV__ so you can verify the shape.
 */
export class UserRemoteDataSource {
  async findAll(): Promise<UserDto[]> {
    const response = await apiClient.get<ApiResponseDto<UserDto[]> | UserDto[]>('/users');

    if (__DEV__) {
      console.log('[UserRemoteDataSource] GET /users →', JSON.stringify(response.data, null, 2));
    }

    return unwrap<UserDto[]>(response.data);
  }

  async findById(id: string): Promise<UserDto> {
    const response = await apiClient.get<ApiResponseDto<UserDto> | UserDto>(`/users/${id}`);

    if (__DEV__) {
      console.log(`[UserRemoteDataSource] GET /users/${id} →`, JSON.stringify(response.data, null, 2));
    }

    return unwrap<UserDto>(response.data);
  }
}
