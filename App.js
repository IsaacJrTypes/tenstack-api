import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, TextInput,SafeAreaView } from 'react-native';
import {QueryClient,QueryClientProvider,useMutation,useQuery,useQueryClient} from '@tanstack/react-query';
import { NativeWindStyleSheet } from "nativewind";

NativeWindStyleSheet.setOutput({
  default: "native",
});


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
    console.error(`Error from create post${err}`)
  }
}



// Create a client
const queryClient = new QueryClient();


function BlogPosts() {
  const queryClient = useQueryClient()

  const [post,setPost] = useState(null)
  const [editId, setEditId] = useState(null)
  const [editPost, setEditPost] = useState({ title: '', body: '', userId: '', id: '' })
  const [inputPost, setInputPost] = useState({ title: '', body: '', userId: '', id: '' })

  const {data, isLoading, isError, refetch} = useQuery({
    queryKey: ['posts'],
    queryFn: getAllPosts,
    onSuccess: () => { console.log('triggered data query check')}
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

  const updateMutation = useMutation({
    mutationKey: ['posts', editPost.id],
    mutationFn: async (editPost) => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${editPost.id}`, {
        method: 'PUT',
        body: JSON.stringify(editPost),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const result = await response.json();
      console.log('update fetch', result);
      return result;
    },
    onSuccess: (fetchUpdate) => {
      console.log('update triggered');
      queryClient.setQueryData(['posts'], (oldData = []) => {
        const result = oldData.map((post) => (post.id === fetchUpdate.id ? fetchUpdate : post));
        console.log('updated post', result);
        return result;
      });

      setEditId(null);
    },
  });

  
  useEffect(() => {
    if(data) {
      console.log('Data updated:',data[0])
    }
    ;
  }, [data]);


  const handleInputChange = (prop,value,callback) => {
    //console.log("before:",inputPost)
    if (prop === 'userId') {
      value = parseInt(value)
    }
    callback((prev) => {
      const updatedPost = { ...prev, [prop]: value };
      console.log('onchange:', updatedPost);
      return updatedPost;
    });
  }

  const startEdit = (post) => {
    setEditId(post.id);
    setEditPost(post);
  };


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
            <TextInput className='border-gray-400 border-solid border-2 w-40' placeholder={"User ID"} onChangeText={(input) => { handleInputChange('userId', input, setInputPost)}} />
            <TextInput className='border-gray-400 border-solid border-2 w-40 my-3' placeholder={"Title"} onChangeText={(input) => { handleInputChange('title', input, setInputPost)}} />
            <TextInput className='border-gray-400 border-solid border-2 w-40 my-3' placeholder={"body"} onChangeText={(input) => { handleInputChange('body', input, setInputPost)}} />
            <Pressable className='border-solid border-2 border-sky-500'>
            <Text onPress={() => { createMutation.mutate({...inputPost})} } > Create Mutate Button</Text>
          </Pressable>
          { post ? <Text>{JSON.stringify(post)}</Text>: <Text>Empty state</Text> }
          {data.map((post) => {
            return (
            <View className='border-solid border-green border-2 my-3'
                key={post.id}>
                {editId === post.id ? 
                  (<View>
                    <TextInput value= {editPost.userId.toString()} onChangeText={(input) => { handleInputChange('userid',input,setEditPost)}}/>
                    <TextInput value={editPost.title}  onChangeText={(input) => { handleInputChange('title',input,setEditPost)}}/>
                    <TextInput value={editPost.body}  onChangeText={(input) => { handleInputChange('body',input,setEditPost)}}/>
                    <Pressable className='border-solid border-2 border-sky-500' onPress={() => updateMutation.mutate(editPost,data)}>
                      <Text>Save</Text>
                    </Pressable>
                  </View>)
                  :
                  (<View>
                      <Text>UserID: {post.userId}</Text>
                      <Text>Title: {post.title}</Text>
                      <Text>Body: {post.body}</Text>
                    <Pressable className='border-solid border-2 border-sky-500' onPress={() => startEdit(post)}>
                        <Text>Edit</Text>
                      </Pressable>
                    </View>)
                }
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

