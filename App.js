import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import {QueryClient,QueryClientProvider,useQuery} from '@tanstack/react-query';
import { useState } from 'react';
import FetchAll from './components/FetchAll';
import FetchBreed from './components/FetchBreed';
import FetchGroup from './components/FetchGroup';
import FetchFact from './components/FetchFact';

// Create a client
const queryClient = new QueryClient();


function Doggos() {
  const [breedID, setBreedID] = useState("");
  

  console.log("breedID: ", breedID);
  if (breedID == ""|| breedID=="group" || breedID=="fact") {
    
    if(breedID == "fact") {
      return <FetchFact setState={setBreedID}/>
    }

    if(breedID=="group") {
      return (<FetchGroup setState={setBreedID}/>)
    }
   return (<FetchAll setState={setBreedID}/>)
  } else if (breedID) {
    return (<FetchBreed setState={setBreedID} breedID={breedID}/>)
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        <Doggos />
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
    minHeight: '100vh',
  },
});
