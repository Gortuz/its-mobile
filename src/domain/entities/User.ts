/**
 * Domain entity — the canonical User model for the mobile app.
 * No framework or library dependencies allowed here.
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  isActive: boolean;
  role?: string;
}
