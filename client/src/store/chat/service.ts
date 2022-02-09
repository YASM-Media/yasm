import {
  collection,
  DocumentData,
  Query,
  query,
  where,
} from 'firebase/firestore';
import { firebaseAuth, firebaseFirestore } from './../../utils/firebase';

export const listenToThreads = (): Query<DocumentData> => {
  const userId = firebaseAuth.currentUser!.uid;

  const threadsQuery = query(
    collection(firebaseFirestore, 'threads'),
    where('participants', 'array-contains', userId)
  );

  return threadsQuery;
};
