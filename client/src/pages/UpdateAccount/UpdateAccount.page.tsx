import { Flex, Heading } from '@chakra-ui/layout';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs';
import React from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import UpdateEmail from '../../components/accountUpdate/UpdateEmail.component';
import UpdatePassword from '../../components/accountUpdate/updatePassword.component';
import UpdateProfile from '../../components/accountUpdate/UpdateProfile.component';

export interface UpdateAccountProps {}

const UpdateAccount: React.FunctionComponent<UpdateAccountProps> = () => {
  const user = useSelector((state: RootStateOrAny) => state.auth);

  return (
    <React.Fragment>
      <Flex
        align='flex-start'
        justify='flex-start'
        direction='column'
        p={{ base: 0, lg: 25 }}
      >
        <Heading marginY={25}>Update Your Profile Here!!🌟</Heading>
        <Tabs variant='soft-rounded' isLazy>
          <TabList>
            <Tab>User Details</Tab>
            <Tab>Email Address</Tab>
            <Tab>Password</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <UpdateProfile user={user.loggedInUser} />
            </TabPanel>
            <TabPanel>
              <UpdateEmail user={user.loggedInUser} />
            </TabPanel>
            <TabPanel>
              <UpdatePassword />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </React.Fragment>
  );
};

export default UpdateAccount;
