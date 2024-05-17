import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { useState } from 'react';




// Create a client
const queryClient = new QueryClient();

async function fetchAllDoggos() {
  try {
    const response = await fetch('https://dogapi.dog/api/v2/breeds');
    return response.json();
  } catch (err) {
    console.error('Fetch error:', err);
  }
}
async function fetchDoggoID(breedID) {
  console.log("fetchID", breedID);
  try {
    const response = await fetch(`https://dogapi.dog/api/v2/breeds/${breedID}`);
    return response.json();
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

function Doggos() {
  const [breedID, setBreedID] = useState("");
  console.log("breedID:", breedID);
  if (breedID == "") {
    const { isPending, isError, isSuccess, data, error } = useQuery({
      queryKey: ['doggos'],
      queryFn: fetchAllDoggos,
    });

    if (isError) {
      console.error(error);
      return <Text>Errr</Text>;
    }

    if (isPending) {
      return <Text>Fetching, woof...</Text>;
    }

    if (isSuccess) {
      console.log('Great scott, it worked!!');
    }

    if (data) {
      console.log(data);
      console.log(breedID);
    }
    return (
      <ScrollView>
        <View>
          {data.data.map((obj) => {
            return (
              <Pressable
                key={obj.id}
                onPress={() => setBreedID(obj.id)}
              >
                <Text>{obj.attributes.name}</Text>
              </Pressable>
            );
          })}
        </View>
        <View>
          <Pressable onPress={() => setBreedID("")}>
            <Text>Reset</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  } else if (breedID) {
    const { isPending, isError, isSuccess, data, error } = useQuery({
      queryKey: ['doggos', breedID],
      queryFn: () => fetchDoggoID(breedID),
    });

    if (isError) {
      console.error(error);
      return <Text>Errr</Text>;
    }

    if (isPending) {
      return <Text>Fetching, woof...</Text>;
    }

    if (isSuccess) {
      console.log('Great scott, it worked!!');
    }

    if (data) {
      console.log(data);
    }
    const dogInfo = data.data.attributes
    return (
      <ScrollView>
        <View>
          <Text>Name: {dogInfo.name}</Text>
          <Text>Description: {dogInfo.description}</Text>
          <Text>Hypoallergenic: {dogInfo.hypoallergenic ? "Yes :)": "No :("}</Text>
        </View>
        <View>
          <Pressable onPress={() => setBreedID("")}>
            <Text>Reset</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
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
