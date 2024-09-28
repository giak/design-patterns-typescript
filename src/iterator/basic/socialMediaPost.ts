interface SocialMediaPostInterface {
  id: number;
  content: string;
  likes: number;
}

interface Iterator<T> {
  next(): IteratorResult<T>;
  hasNext(): boolean;
}

class SocialMediaFeed implements Iterable<SocialMediaPostInterface> {
  private posts: SocialMediaPostInterface[] = [];

  addPost(post: SocialMediaPostInterface): void {
    this.posts.push(post);
  }

  [Symbol.iterator](): Iterator<SocialMediaPostInterface> {
    let index = 0;
    const posts = this.posts;

    return {
      next(): IteratorResult<SocialMediaPostInterface> {
        if (index < posts.length) {
          return { done: false, value: posts[index++] };
        }
        return { done: true, value: undefined };
      },
      hasNext(): boolean {
        return index < posts.length;
      },
    };
  }

  getPopularPostsIterator(): Iterator<SocialMediaPostInterface> {
    const popularPosts = this.posts.filter((post) => post.likes > 100);
    let index = 0;

    return {
      next(): IteratorResult<SocialMediaPostInterface> {
        if (index < popularPosts.length) {
          return { done: false, value: popularPosts[index++] };
        }
        return { done: true, value: undefined };
      },
      hasNext(): boolean {
        return index < popularPosts.length;
      },
    };
  }
}

// Utilisation
const feed = new SocialMediaFeed();
feed.addPost({ id: 1, content: 'Hello World', likes: 50 });
feed.addPost({ id: 2, content: 'TypeScript is awesome', likes: 150 });
feed.addPost({ id: 3, content: 'Iterator pattern rocks', likes: 200 });

console.log('All posts:');
for (const post of feed) {
  console.log(post.content);
}

console.log('Popular posts:');
const popularIterator = feed.getPopularPostsIterator();
while (popularIterator.hasNext()) {
  console.log(popularIterator.next().value?.content);
}

export type {};
