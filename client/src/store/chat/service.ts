import {
  collection,
  doc,
  DocumentData,
  DocumentReference,
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

export const listenToThread = (
  threadId: string
): DocumentReference<DocumentData> => {
  const threadDocument = doc(firebaseFirestore, 'threads', threadId);

  return threadDocument;
};
