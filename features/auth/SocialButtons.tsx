import { Button } from '@/components/Button';

/** Placeholder buttons; they will be wired to Google/Facebook SSO later. */
export const SocialButtons = () => (
  <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-1 lg:gap-3">
    <Button
      variant="secondary"
      fullWidth
      disabled
      title="Coming soon"
      aria-label="Continue with Google"
    >
      <span className="lg:hidden">Google</span>
      <span className="hidden lg:inline">Continue with Google</span>
    </Button>
    <Button
      variant="secondary"
      fullWidth
      disabled
      title="Coming soon"
      aria-label="Continue with Facebook"
    >
      <span className="lg:hidden">Facebook</span>
      <span className="hidden lg:inline">Continue with Facebook</span>
    </Button>
  </div>
);
