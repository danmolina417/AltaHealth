/** Form-level error (e.g. wrong credentials), shown above the submit button. */
export const FormError = ({ message }: { message?: string | undefined }) =>
  message ? (
    <p role="alert" className="text-sm text-danger">
      {message}
    </p>
  ) : null;
