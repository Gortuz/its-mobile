import type { UserRepository } from '../repositories/UserRepository';

export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }
}
