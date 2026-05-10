import type { User } from '../entities/User';
import type { UserRepository } from '../repositories/UserRepository';

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(user: Omit<User, 'id'>): Promise<User> {
    return this.userRepository.create(user);
  }
}
