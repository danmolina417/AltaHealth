/** Unknown API routes answer with a JSON 404 instead of falling through to the page catch-all. */
const notFound = () => Response.json({ error: 'Not Found' }, { status: 404 });

export {
  notFound as DELETE,
  notFound as GET,
  notFound as PATCH,
  notFound as POST,
  notFound as PUT,
};
