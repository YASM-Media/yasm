import {
  collection,
  doc,
  DocumentData,
  DocumentReference,
  getDocs,
  Query,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { Thread } from '../../models/thread.model';
import { firebaseAuth, firebaseFirestore } from './../../utils/firebase';
import { v4 } from 'uuid';

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

export const markThreadSeen = async (thread: Thread): Promise<void> => {
  try {
    const userId = firebaseAuth.currentUser!.uid;

    if (thread.seen.filter((id) => id === userId).length === 1) {
      return;
    }

    thread.seen.push(userId);
    const rawThread = thread.toJson();

    await setDoc(doc(firebaseFirestore, 'threads', thread.id), rawThread);
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong, please try again later');
  }
};

const checkForDuplicates = async (participants: string[]): Promise<string> => {
  const originalParticipants = [...participants];
  const reversedParticipants = [...participants.reverse()];

  const firstThreadQuerySnapshot = query(
    collection(firebaseFirestore, 'threads'),
    where('participants', 'in', [originalParticipants])
  );

  const firstThreadDocuments = await (
    await getDocs(firstThreadQuerySnapshot)
  ).docs;

  const secondThreadQuerySnapshot = query(
    collection(firebaseFirestore, 'threads'),
    where('participants', 'in', [reversedParticipants])
  );

  const secondThreadDocuments = await (
    await getDocs(secondThreadQuerySnapshot)
  ).docs;

  if (firstThreadDocuments.length !== 0 && firstThreadDocuments[0].exists) {
    return firstThreadDocuments[0].id;
  } else if (
    secondThreadDocuments.length !== 0 &&
    secondThreadDocuments[0].exists
  ) {
    return secondThreadDocuments[0].id;
  } else {
    return 'EMPTY';
  }
};