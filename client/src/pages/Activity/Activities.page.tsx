import { useEffect, useState } from 'react';
import ActivityList from '../../components/activity/ActivityList.component';
import Loading from '../../components/lottie/Loading.animation';
import { Activity } from '../../models/activity.model';
import * as activityService from './../../store/activity/service';

const Activities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    activityService
      .fetchActivity()
      .then((a) => setActivities(a))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  return loading ? (
    <Loading message='Loading activities for you' />
  ) : (
    <ActivityList activities={activities} />
  );
};

export default Activities;
