import { Avatar, Box, Flex, Link, Text } from '@chakra-ui/react';
import { BsPersonFill } from 'react-icons/bs';
import { FaComment } from 'react-icons/fa';
import { MdFavorite } from 'react-icons/md';
import { Activity } from '../../models/activity.model';

export interface ActivityListItemProps {
  activity: Activity;
}

const ActivityListItem: React.FC<ActivityListItemProps> = ({ activity }) => {
  return (
    <Link
      href={
        activity.activityType === 'FOLLOW'
          ? `/account/profile/${activity.triggeredByUser.id}`
          : `/account/profile/${activity.mainUser.id}`
      }
    >
      <Flex direction='row' justify='space-evenly' align='center' m='0.7em'>
        <Avatar
          color='pink.500'
          backgroundColor='transparent'
          icon={
            activity.activityType === 'FOLLOW' ? (
              <BsPersonFill size='1.75em' />
            ) : activity.activityType === 'LIKE' ? (
              <MdFavorite size='1.75em' />
            ) : (
              <FaComment size='1.75em' />
            )
          }
          marginX='0.5em'
        />
        <Flex direction='column'>
          <Box w='10em' m='0.01em'>
            <Text>
              {activity.activityType === 'FOLLOW'
                ? 'New Follow!'
                : activity.activityType === 'LIKE'
                ? 'New Like!'
                : 'New Comment'}
            </Text>
          </Box>
          <Box w='10em' m='0.01em'>
            <Text fontSize='xs'>
              {activity.activityType === 'FOLLOW'
                ? `${activity.triggeredByUser.firstName} ${activity.triggeredByUser.lastName} followed you`
                : activity.activityType === 'LIKE'
                ? `${activity.triggeredByUser.firstName} ${activity.triggeredByUser.lastName} liked your post`
                : `${activity.triggeredByUser.firstName} ${activity.triggeredByUser.lastName} commented on your post`}
            </Text>
          </Box>
        </Flex>
        <Avatar
          src={
            activity.activityType === 'FOLLOW'
              ? activity.triggeredByUser.imageUrl
              : activity.post?.images[0].imageUrl
          }
          name={
            activity.activityType === 'FOLLOW'
              ? activity.triggeredByUser.imageUrl
              : ''
          }
          marginX='0.5em'
        />
      </Flex>
    </Link>
  );
};

export default ActivityListItem;
