import { getHealthStatus } from '@/lib/health';

export const GET = () => Response.json(getHealthStatus());
