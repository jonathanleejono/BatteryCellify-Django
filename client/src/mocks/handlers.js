import { rest } from 'msw';

export const handlers = [
  rest.post('/api/login', (req, res, ctx) => {
    const { email } = req.body;

    // ctx means context

    return res(
      ctx.json({
        id: 13,
        user: {
          email,
          first_name: 'silas',
          last_name: 'whatever',
        },
      })
    );
  }),
];
