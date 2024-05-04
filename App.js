import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';


// Create a client
const queryClient = new QueryClient();


async function fetchDoggos() {
  try {
    const response = await fetch('https://dogapi.dog/api/v2/breeds');
    return response.json();
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

function Doggos() {
  const { isPending, isError, isSuccess, data, error } = useQuery({
    queryKey: ['doggos'],
    queryFn: fetchDoggos
  });

  if (isError) {
    console.error(error);
    return <Text>Errr</Text>;
  }

  if (isPending) {
    return <Text>Fetching, woof...</Text>;
  }

  if (isSuccess) {
    console.log("Great scott, it worked!!");
  }

  if (data) {
    console.log(data);
  }
  return (
    <ScrollView>
      <View>
        {data.data.map((obj) => {
          return <Text key={obj.id}>{JSON.stringify(obj, null, 2)}</Text>;
        })}
      </View>
    </ScrollView>
  );
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
    minHeight: '100vh'
  },
});
