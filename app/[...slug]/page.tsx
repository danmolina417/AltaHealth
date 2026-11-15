import { redirect } from 'next/navigation';
import { paths } from '@/lib/paths';

/** Unknown URLs go to the home page, which sends signed-out visitors on to login. */
export default function UnknownRoutePage() {
  redirect(paths.home);
}
