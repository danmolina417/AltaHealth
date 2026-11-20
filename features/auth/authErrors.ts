/** The parts of a Better Auth client error the forms look at. */
export interface AuthClientError {
  status: number;
  code?: string | undefined;
}

const tooManyAttempts = 'Too many attempts. Try again in a minute.';
const generic = 'Something went wrong. Please try again.';

export const loginErrorMessage = ({ status }: AuthClientError) => {
  if (status === 429) return tooManyAttempts;
  if (status === 401) return 'Email or password is incorrect.';
  return generic;
};

export const signupErrorMessage = ({ status, code }: AuthClientError) => {
  if (status === 429) return tooManyAttempts;
  if (status === 422 && code?.startsWith('USER_ALREADY_EXISTS')) {
    return 'An account with this email already exists.';
  }
  return generic;
};
