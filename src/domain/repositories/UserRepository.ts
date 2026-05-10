import type { User } from '../entities/User';

/**
 * Abstract repository contract owned by the Domain layer.
 * The Data layer must implement this interface.
 */
export interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User>;
  create(user: Omit<User, 'id'>): Promise<User>;
  update(id: string, user: Partial<Omit<User, 'id'>>): Promise<User>;
  delete(id: string): Promise<void>;
}
