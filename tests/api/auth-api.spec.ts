import { expect, test } from '@playwright/test';

test('[API-01] @api should reject login for an unknown user', async ({
  request,
}) => {
  const response = await request.post('/login', {
    data: {
      username: `missing-user-${Date.now()}`,
      password: 'invalid-password',
    },
  });

  expect(response.ok()).toBe(true);
  const body = (await response.json()) as { errorMessage?: string };
  expect(body.errorMessage).toMatch(/user does not exist/i);
});
