import { Thread } from '../../models/thread.model';
import NoData from '../lottie/NoData.animation';
import ThreadTile from './ThreadTile.component';

export interface ThreadListProps {
  threads: Thread[];
}

const ThreadList: React.FC<ThreadListProps> = ({ threads }) => {
  return (
    <>
      {threads.length > 0 ? (
        threads.map((thread) => <ThreadTile key={thread.id} thread={thread} />)
      ) : (
        <NoData message='You have no messages' />
      )}{' '}
    </>
  );
};

export default ThreadList;
