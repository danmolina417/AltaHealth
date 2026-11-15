import { z } from 'zod';

const email = z.string().min(1, 'Email is required').email('Enter a valid email address');
const password = z.string().min(1, 'Password is required');

export const loginSchema = z.object({ email, password });
export type LoginValues = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email,
  password: password.min(8, 'Password must be at least 8 characters'),
});
export type SignupValues = z.infer<typeof signupSchema>;
