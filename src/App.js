import "./App.css";
import Homepage from "./Homepage";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
import { Authenticator, View } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { BrowserRouter as Router } from "react-router-dom";
import { generateClient } from '@aws-amplify/api';
import { createUser } from './graphql/mutations';
import { fetchUserAttributes } from '@aws-amplify/auth';
import { useState, useEffect } from 'react';

Amplify.configure(awsExports);

function App() {
  const client = generateClient();
  const [userChecked, setUserChecked] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const ensureUserExists = async (user) => {
    if (!user || userChecked) return;
    try {
      const attributes = await fetchUserAttributes();
      const userId = attributes.sub;
      setCurrentUserId(userId); // Ensure ID is set
      const username = attributes.preferred_username || attributes.email.split('@')[0] || 'defaultUser';

      const response = await client.graphql({
        query: createUser,
        variables: {
          input: {
            id: userId,
            username,
          },
        },
      });

      if (response.errors) throw new Error(JSON.stringify(response.errors));
      console.log('User created or verified:', userId);
      setUserChecked(true);
    } catch (error) {
      if (error.errors?.some(e => e.errorType === 'DynamoDB:ConditionalCheckFailedException')) {
        console.log('User already exists:', user.id);
        setUserChecked(true);
      } else {
        console.error('Error ensuring user exists:', error);
      }
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const attributes = await fetchUserAttributes();
        const userId = attributes.sub;
        setCurrentUserId(userId);
        console.log('Initial fetch currentUserId:', userId);
      } catch (error) {
        console.log('No user signed in yet:', error);
      }
    };
    checkUser();
  }, []);

  return (
    <Router>
      <Authenticator>
        {({ user }) => {
          console.log('Authenticator user:', user);
          if (user && user.attributes && user.attributes.sub !== currentUserId) {
            setCurrentUserId(user.attributes.sub); 
          }
          ensureUserExists(user);
          console.log('App rendering with currentUserId:', currentUserId);
          return (
            <View className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
              <div className="app w-full">
                <Homepage currentUserId={currentUserId} />
              </div>
            </View>
          );
        }}
      </Authenticator>
    </Router>
  );
}

export default App;