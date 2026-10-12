export const demoBlazeData = {
  validPassword: 'StrongPass123!',
  invalidUser: {
    username: 'wronguser',
    password: 'wrongpass',
  },
  product: {
    name: 'Samsung galaxy s6',
  },
  order: {
    customerName: 'Automation Tester',
    customerCountry: 'USA',
    customerCity: 'Seattle',
    cardNumber: '123',
    month: '12',
    year: '2030',
  },
};

export const getUniqueUserName = (): string => `demoUser${Date.now()}`;
