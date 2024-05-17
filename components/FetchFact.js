import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

async function fetchRandomFact() {
    try {
        const response = await fetch('https://dogapi.dog/api/v2/facts');
        return response.json();
    } catch (err) {
        console.error('Fetch error:', err);
    }
}


export default function FetchFact({setState}) {
    const { isPending, isError, isSuccess, data, error } = useQuery({
        queryKey: ['doggos'],
        queryFn: fetchRandomFact
    });

    if (isError) {
        console.error(error);
        return <Text>Errr</Text>;
    }

    if (isPending) {
        return <Text>Fetching, woof...</Text>;
    }

    if (isSuccess) {
        console.log('Great scott, it worked. Fact!!');
    }

    if (data) {
        console.log(data)
    }
    return (
        <ScrollView>
            <View>
                <Text>{JSON.stringify(data.data[0].attributes.body,null,2)}</Text>
            </View>
            <View>
                <Pressable onPress={() => setState("")}>
                    <Text>Reset</Text>
                </Pressable>
            </View>
        </ScrollView>
    )
}