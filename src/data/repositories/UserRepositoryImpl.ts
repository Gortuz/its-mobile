import type { User } from '@src/domain/entities/User';
import type { UserRepository } from '@src/domain/repositories/UserRepository';
import { UserMapper } from '@src/data/mappers/UserMapper';
import type { UserRemoteDataSource } from '@src/data/sources/UserRemoteDataSource';

/**
 * Concrete implementation of the domain UserRepository contract.
 * Depends on the remote data source (injection via constructor) and the mapper.
 */
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly remoteDataSource: UserRemoteDataSource) {}

  async findAll(): Promise<User[]> {
    const dtos = await this.remoteDataSource.findAll();
    return UserMapper.toDomainList(dtos);
  }

  async findById(id: string): Promise<User> {
    const dto = await this.remoteDataSource.findById(id);
    return UserMapper.toDomain(dto);
  }
}
