const target = {
  message1: 'hello',
  message2: 'everyone',
};

const handler: ProxyHandler<Record<string | symbol, unknown>> = {
  get(target: Record<string | symbol, unknown>, prop: string | symbol, receiver: unknown) {
    console.log(`Property ${String(prop)} accessed`);
    return Reflect.get(target, prop, receiver);
  },
  set(target, prop, value, receiver) {
    console.log(`Property ${String(prop)} set to ${value}`);
    return Reflect.set(target, prop, value, receiver);
  },
};

const proxy = new Proxy(target, handler);

console.log(proxy.message1); // Logs: Property message1 accessed
proxy.message2 = 'world'; // Logs: Property message2 set to world

export {};
