import type { User } from '../entities/User';
import type { UserRepository } from '../repositories/UserRepository';

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, user: Partial<Omit<User, 'id'>>): Promise<User> {
    return this.userRepository.update(id, user);
  }
}
