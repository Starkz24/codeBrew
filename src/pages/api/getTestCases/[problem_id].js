// pages/api/getProblem/[problem_id].js
import { db } from '../../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  const { problem_id } = req.query;

  try {
    // Reference to the document in Firestore
    const docRef = doc(db, 'problems', problem_id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Return the problem data from Firestore
      res.status(200).json(docSnap.data());
    } else {
      res.status(404).json({ error: 'Problem not found for the given problem_id' });
    }
  } catch (error) {
    console.error('Error fetching problem data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
