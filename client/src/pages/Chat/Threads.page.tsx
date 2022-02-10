import { useEffect, useState } from 'react';
import { Thread } from '../../models/thread.model';
import { DocumentData, onSnapshot, QuerySnapshot } from 'firebase/firestore';
import * as chatService from './../../store/chat/service';
import ThreadList from '../../components/chat/ThreadList.component';

const Threads: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    const threadsSubscription = onSnapshot(
      chatService.listenToThreads(),
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        const threads = querySnapshot.docs.map((thread) =>
          Thread.fromJson(thread.data())
        );

        setThreads(threads);
      }
    );

    return threadsSubscription;
  }, []);

  return <ThreadList threads={threads} />;
};

export default Threads;
