import type { User } from '../entities/User';

/**
 * Abstract repository contract owned by the Domain layer.
 * The Data layer must implement this interface.
 */
export interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User>;
}
