/**
 * Domain entity — the canonical User model for the mobile app.
 * No framework or library dependencies allowed here.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}
