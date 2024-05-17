import { useQuery } from '@tanstack/react-query';
import { Text, View, ScrollView, Pressable } from 'react-native';

async function fetchAllDoggos() {
    try {
        const response = await fetch('https://dogapi.dog/api/v2/breeds');
        return response.json();
    } catch (err) {
        console.error('Fetch error:', err);
    }
}

export default function FetchAll({setState}) {

    
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
    }
    return (
        <ScrollView>
            <View>
                {data.data.map((obj) => {
                    return (
                        <Pressable
                            key={obj.id}
                            onPress={() => setState(obj.id)}
                        >
                            <Text>{obj.attributes.name}</Text>
                        </Pressable>
                    );
                })}
            </View>
            <View>
                <Pressable onPress={() => setState("")}>
                    <Text>Reset</Text>
                </Pressable>
                <Pressable onPress={() => setState("group")}>
                    <Text>FetchGroup</Text>
                </Pressable>
                <Pressable onPress={() => setState("fact")}>
                    <Text>FetchRandomFact</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}