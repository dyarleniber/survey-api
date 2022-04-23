export const notFound = {
  description: 'Not found',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error',
      },
    },
  },
};
