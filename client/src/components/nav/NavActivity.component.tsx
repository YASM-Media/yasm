import { Avatar, Box } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { MdFavorite } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import { Activity } from '../../models/activity.model';
import DisplayActivity from '../activity/DisplayActivity.component';
import * as activityService from './../../store/activity/service';

const NavActivity: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [displayActivity, setDisplayActivity] = useState<boolean>(false);

  const history = useHistory();
  const containerRef = useRef(null);

  useEffect(() => {
    activityService
      .fetchActivity()
      .then((activities) => setActivity(activities))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <React.Fragment>
      <Box
        display={{ base: 'none', md: 'block' }}
        ref={containerRef}
        onClick={() => setDisplayActivity(!displayActivity)}
      >
        <Avatar
          icon={<MdFavorite color='white' size='2.4em' />}
          size='sm'
          backgroundColor='transparent'
        />
      </Box>
      <Box
        display={{ base: 'block', md: 'none' }}
        onClick={() => history.push('/activities')}
      >
        <Avatar
          icon={<MdFavorite color='white' size='1.75em' />}
          size='sm'
          backgroundColor='transparent'
        />
      </Box>
      <DisplayActivity
        containerRef={containerRef}
        activities={activity}
        display={displayActivity}
        loading={loading}
      />
    </React.Fragment>
  );
};

export default NavActivity;
