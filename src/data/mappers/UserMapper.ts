import type { User } from '@src/domain/entities/User';

/**
 * Shape of the User object as returned by the API Gateway.
 * Keep this separate from the domain entity so mapping is explicit.
 */
export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: string;
}

/**
 * Wraps all gateway responses per the ApiResponseDto contract.
 */
export interface ApiResponseDto<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export class UserMapper {
  static toDomain(dto: UserDto): User {
    return {
      id: dto.id,
      name: dto.name,
      email: dto.email,
      role: dto.role,
    };
  }

  static toDomainList(dtos: UserDto[]): User[] {
    return dtos.map(UserMapper.toDomain);
  }
}
