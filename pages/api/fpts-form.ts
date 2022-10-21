import type { NextApiRequest, NextApiResponse } from 'next'

export default function formHandler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { formName, formPassword, formCheckTest },
    method,
  } = req

  switch (method) {
    case 'POST':
      // Get data from your database
      res.status(200);
      res.redirect('/success');
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}