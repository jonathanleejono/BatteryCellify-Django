import { rest } from 'msw';

export const handlers = [
  rest.post('/api/register', (req, res, ctx) => {
    const { email, first_name, last_name, password } = req.body;

    // ctx means context

    return res(
      ctx.json({
        id: 1,
        user: {
          email,
          first_name,
          last_name,
          password,
          // first_name: 'silas',
          // last_name: 'whatever',
        },
      })
    );
  }),
];
