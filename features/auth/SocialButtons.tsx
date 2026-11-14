import { Button } from '@/components/Button';

/** Placeholder buttons; they will be wired to Google/Facebook SSO later. */
export const SocialButtons = () => (
  <div className="flex flex-col gap-3">
    <Button variant="secondary" fullWidth disabled title="Coming soon">
      Continue with Google
    </Button>
    <Button variant="secondary" fullWidth disabled title="Coming soon">
      Continue with Facebook
    </Button>
  </div>
);
