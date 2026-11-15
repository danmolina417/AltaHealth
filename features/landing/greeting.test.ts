import { getGreeting } from './greeting';

describe('getGreeting', () => {
  it.each([
    [0, 'Good morning'],
    [11, 'Good morning'],
    [12, 'Good afternoon'],
    [17, 'Good afternoon'],
    [18, 'Good evening'],
    [23, 'Good evening'],
  ])('at %i:00 returns "%s"', (hour, expected) => {
    expect(getGreeting(new Date(2026, 0, 1, hour))).toBe(expected);
  });
});
