import type { User } from '../entities/User';
import type { UserRepository } from '../repositories/UserRepository';

/**
 * Use-case: Retrieve all users.
 *
 * Single-responsibility: delegates to the repository contract.
 * The caller (hook) never imports from the data layer.
 */
export class GetAllUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
