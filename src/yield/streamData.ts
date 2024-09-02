import { setTimeout } from 'timers/promises';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

async function* streamData(url: string): AsyncGenerator<Post, void, unknown> {
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Post[] = await response.json();

      for (const post of data) {
        yield post;
      }

      return; // Successful completion
    } catch (error) {
      console.error(`Attempt ${retryCount + 1} failed:`, error);
      retryCount++;

      if (retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await setTimeout(delay);
      } else {
        console.error('Max retries reached. Giving up.');
        throw error;
      }
    }
  }
}

async function processStream() {
  try {
    const stream = streamData('https://jsonplaceholder.typicode.com/posts');

    for await (const post of stream) {
      console.log(`Processing post ${post.id}: ${post.title}`);
      // Ici, vous pouvez ajouter votre logique de traitement pour chaque post
    }

    console.log('Stream processing completed.');
  } catch (error) {
    console.error('Error in stream processing:', error);
  }
}

processStream();