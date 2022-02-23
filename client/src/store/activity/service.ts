import { Activity } from '../../models/activity.model';
import { firebaseAuth } from '../../utils/firebase';

/**
 * Method to fetch user activity from server.
 * @returns Activity[] array of all activity.
 */
export const fetchActivity = async (): Promise<Activity[]> => {
  // Send a request to the server for fetching activities.
  const response = await fetch('/v1/api/activity', {
    method: 'GET',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${await firebaseAuth.currentUser?.getIdToken()}`,
    },
  });

  // Check for errors and send error message to client.
  if (!response.ok) {
    const responseJson = await response.json();
    const message = responseJson.message;

    throw new Error(message);
  }

  // Get Response JSON
  const rawActivities = await response.json();

  // Convert to activity objects.
  const activities: Activity[] = rawActivities.map((rawActivity: any) =>
    Activity.fromJson(rawActivity)
  );

  return activities;
};
