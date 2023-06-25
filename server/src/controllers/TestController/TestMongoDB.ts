import { Request, Response } from 'express';
import GetGlobalDB from '../../lib/database/GlobalDB';

/**
 * Creates a document in the Test collection
 */
export default async function TestMongoDB(_: Request, res: Response) {
  const GlobalDB = GetGlobalDB();

  try {
    const doc = await GlobalDB.addItem('Test', { Name: 'Test' });

    res.status(200).send({ doc });
  } catch (err) {
    console.log(err);

    res.status(500).send({ message: 'Error creating test record!' });
  }
}
