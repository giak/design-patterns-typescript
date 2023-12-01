type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface BodyInterface {
  title: string;
  body: string;
  userId: number;
}

interface ApiRequestInterface {
  url: string;
  method: HttpMethod;
  header: { [key: string]: string };
  body?: BodyInterface;
}

interface ApiRequestBuilder {
  setUrl(url: string): ApiRequestBuilder;
  setMethod(method: HttpMethod): ApiRequestBuilder;
  setHeader(key: string, value: string): ApiRequestBuilder;
  setBody(body: BodyInterface): ApiRequestBuilder;
  build(): ApiRequestInterface;
}

class SimpleApiRequestBuilder implements ApiRequestBuilder {
  private url: string = '';
  private method: HttpMethod = 'GET';
  private header: { [key: string]: string } = {};
  private body?: BodyInterface;

  public setUrl(url: string): ApiRequestBuilder {
    this.url = url;
    return this;
  }

  public setMethod(method: HttpMethod): ApiRequestBuilder {
    this.method = method;
    return this;
  }

  public setHeader(key: string, value: string): ApiRequestBuilder {
    this.header[key] = value;
    return this;
  }

  public setBody(body: BodyInterface): ApiRequestBuilder {
    this.body = body;
    return this;
  }

  public build(): ApiRequestInterface {
    if (!this.url) {
      throw new Error('url is required');
    }
    return {
      url: this.url,
      method: this.method,
      header: this.header,
      body: this.body,
    };
  }
}

async function fetchData(request: ApiRequestInterface) {
  try {
    const response = await fetch(request.url, {
      method: request.method,
      headers: request.header,
      body: JSON.stringify(request.body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

const request = new SimpleApiRequestBuilder()
  .setUrl('https://jsonplaceholder.typicode.com/posts/')
  .setMethod('POST')
  .setHeader('Content-Type', 'application/json; charset=UTF-8')
  .setBody({
    title: 'foo',
    body: 'bar',
    userId: 1,
  })
  .build();

fetchData(request)
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
