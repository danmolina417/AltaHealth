export interface HealthStatus {
  status: 'ok';
  uptimeSeconds: number;
  timestamp: string;
}

export const getHealthStatus = (): HealthStatus => ({
  status: 'ok',
  uptimeSeconds: Math.round(process.uptime()),
  timestamp: new Date().toISOString(),
});
