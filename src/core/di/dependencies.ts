/**
 * Manual Dependency Injection container.
 *
 * Wires concrete implementations to the use-cases exported here.
 * Import use-cases from this file in hooks — never import data-layer
 * classes directly from the presentation layer.
 *
 * Swap any implementation here (e.g. replace with a mock for testing).
 */
import { UserRemoteDataSource } from '@src/data/sources/UserRemoteDataSource';
import { UserRepositoryImpl } from '@src/data/repositories/UserRepositoryImpl';
import { GetAllUsersUseCase } from '@src/domain/use-cases/GetAllUsersUseCase';

// ── Instances ──────────────────────────────────────────────────────────────────
const userRemoteDataSource = new UserRemoteDataSource();
const userRepository = new UserRepositoryImpl(userRemoteDataSource);

// ── Use-cases (export these to hooks) ─────────────────────────────────────────
export const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
