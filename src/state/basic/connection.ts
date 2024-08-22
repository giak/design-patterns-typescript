interface ConnectionStateInterface {
  open(): void;
  close(): void;
  send(data: string): void;
}

class ClosedState implements ConnectionStateInterface {
  open() {
    console.log('Opening connection...');
  }
  close() {
    console.log('Connection already closed');
  }
  send(data: string) {
    console.log('Cannot send. Connection closed');
  }
}

class OpenState implements ConnectionStateInterface {
  open() {
    console.log('Connection already open');
  }
  close() {
    console.log('Closing connection...');
  }
  send(data: string) {
    console.log(`Sending data: ${data}`);
  }
}

export {};
