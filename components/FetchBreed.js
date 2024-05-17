import { useQuery } from '@tanstack/react-query';
import { Text, View, ScrollView, Pressable } from 'react-native';

async function fetchDoggoID(breedID) {
    console.log("fetchID", breedID);
    try {
        const response = await fetch(`https://dogapi.dog/api/v2/breeds/${breedID}`);
        return response.json();
    } catch (err) {
        console.error('Fetch error:', err);
    }
}

export default function FetchBreed({setState,breedID}) {
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
    const dogInfo = data.data.attributes;
    return (
        <ScrollView>
            <View>
                <Text>Name: {dogInfo.name}</Text>
                <Text>Description: {dogInfo.description}</Text>
                <Text>Hypoallergenic: {dogInfo.hypoallergenic ? "Yes :)" : "No :("}</Text>
            </View>
            <View>
                <Pressable onPress={() => setState("")}>
                    <Text>Reset</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}