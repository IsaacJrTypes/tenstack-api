import { useQuery } from '@tanstack/react-query';
import { Text, View, ScrollView, Pressable } from 'react-native';

async function fetchGroup() {
    try {
        const response = await fetch('https://dogapi.dog/api/v2/groups');
        return response.json();
    } catch (err) {
        console.error('Fetch error:', err);
    }
}

export default function FetchGroup({ setState }) {
    const { isPending, isError, isSuccess, data, error } = useQuery({
        queryKey: ['doggos'],
        queryFn: fetchGroup,
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
    return (
        <ScrollView>
            <View>
                {data.data.map((obj)=> {
                    return (
                        <View key={obj.id}>
                            <Text>{obj.attributes.name}</Text>
                        </View>
                    )
                })}
            </View>
            <View>
                <Pressable onPress={() => setState("")}>
                    <Text>Reset</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}