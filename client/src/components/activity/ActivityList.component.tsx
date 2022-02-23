import { Activity } from '../../models/activity.model';
import NoData from '../lottie/NoData.animation';
import ActivityListItem from './ActivityListItem.component';

export interface ActivityListProps {
  activities: Activity[];
}

const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
  return (
    <>
      {activities.length > 0 ? (
        activities.map((activity) => (
          <ActivityListItem key={activity.id} activity={activity} />
        ))
      ) : (
        <NoData message='You have no messages' />
      )}
    </>
  );
};

export default ActivityList;
