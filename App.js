import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, TextInput,SafeAreaView } from 'react-native';
import {QueryClient,QueryClientProvider,useMutation,useQuery,useQueryClient} from '@tanstack/react-query';



// create fetch all post api
async function getAllPosts() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    return response.json();
  } catch (err) {
    console.log('get all post err:',err);
  }
}

// create post api fetch
async function createPost(newData) {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify(newData),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    const result = await response.json()
    console.log('response created', result)
    return result
  } catch (err) {
    console.err(`Error from create post${err}`)
  }
}

// Create a client
const queryClient = new QueryClient();


function BlogPosts() {
  const [post,setPost] = useState(null)
  const [inputPost, setInputPost] = useState({ title: '', body: '', userId: '', id: '' }
)
  const queryClient = useQueryClient()

  const {data, isLoading, isError} = useQuery({
    queryKey: ['posts'],
    queryFn: getAllPosts
  });
  // create a post
  const createMutation = useMutation({
    mutationKey: ['posts'],
    mutationFn: createPost,
    onSuccess: (data) => {
      setPost(data)
      queryClient.invalidateQueries(['posts'])
    }
  })


  const handleInputChange = (prop,value) => {
    console.log("before:",inputPost)
    if (prop === 'userId') {
      value = parseInt(value)
    }
    setInputPost((prev) => {
      const updatedPost = { ...prev, [prop]: value };
      console.log('onchange:', updatedPost);
      return updatedPost;
    });
  }


  if(isError) {
    return <Text>Err...</Text>
  }
  if (isLoading) {
    return <Text>Fetching posts...</Text>
  }
  if (data) {
    //console.log(data)
    return (
      <SafeAreaView>
      <ScrollView>
          <View className='flex flex-col justify-center items-center my-3'>
            <TextInput className='border-gray-400 border-solid border-2 w-40' placeholder={"User ID"} onChangeText={(input)=>{handleInputChange('userId', input)}} />
            <TextInput className='border-gray-400 border-solid border-2 w-40 my-3' placeholder={"Title"} onChangeText={(input)=>{handleInputChange('title', input)}} />
            <TextInput className='border-gray-400 border-solid border-2 w-40 my-3' placeholder={"body"} onChangeText={(input)=>{handleInputChange('body', input)}} />
            <Pressable className='border-solid border-2 border-sky-500'>
            <Text onPress={() => { createMutation.mutate({...inputPost})} } > Create Mutate Button</Text>
          </Pressable>
          { post ? <Text>{JSON.stringify(post)}</Text>: <Text>Empty state</Text> }
          {data.map((post) => {
            return (
            <View className='border-solid border-green border-2 my-3'
                key={post.id}>
              <Text>UserID:{post.userId}</Text>
              <Text>Title:{post.title}</Text>
              <Text>body:{post.body}</Text>
              <Pressable className='border-solid border-2 border-sky-500'>
                <Text onPress={() => { console.log('Edit pressed')}} > Edit Button</Text>
              </Pressable>
              <Pressable className='border-solid border-2 border-sky-500'>
                <Text onPress={() => { console.log('Save pressed') }} > Save Button</Text>
              </Pressable>
            </View>)
          })}
        </View>
      </ScrollView>
      </SafeAreaView>
    )
  }

  
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <View >
        <BlogPosts />
      </View>
    </QueryClientProvider>
  );
}

