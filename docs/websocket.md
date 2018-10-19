# Protocole

#### Connection to server

[client -> server -> client]

Every client connection must first be initialized with a hello message.

```javascript
{
  type: "hello",
  id: 1,
  version: "2",
  auth: {
    headers: {
      authorization: "token"
    }
  },
}
```
* type - set to 'hello'.
* id - a unique per-client request id (number or string).
* version - set to '2'.
* auth - optional authentication credentials. Can be any value understood by the server.

```javascript
{
  type: "hello",
  id: 1,
   heartbeat: {
      interval: 15000,
      timeout: 5000
    },
  socket: "abc-123"
}
```

* type - set to 'hello'.
* id - the same id received from the client.
* heartbeat - the server heartbeat configuration which can be:
    * an object with:
        * interval - the heartbeat interval in milliseconds.
        * timeout - the time from sending a heartbeat to the client until a response is expected before a connection is considered closed by the server.
* socket - the server generated socket identifier for the connection.

#### Subscribe to the matching route

[client -> server -> client]

Sends a subscription request to the matching room. If no error is encountered the client should receive the same message as response.

```javascript
{
  type: "sub",
  id: 1,
  path: "/match"
}
```

* type - set to 'sub'.
* id - a unique per-client request id (number or string).
* path - the requested subscription path.

#### Subscribe to room

[server -> client -> server]

Server sends the path to the room to client.

```javascript
{
  type: "pub",
  path: "/match",
  message: {
    type: "room",
    path: "/room/ihb8ks9z"
  }
}
```

* type - set to 'pub'.
* path - the requested subscription path.
* message - an object with:
    * type - set to 'room'
    * path - the room path
    
After that the client have to join the room.

```javascript
{
  type: "sub",
  id: 1,
  path: "/room/ihb8ks9z"
}
```

#### Unsubscribe

[client -> server]

Unsubscribe from a server subscription.

```javascript
{
  type: "unsub",
  id: 1,
  path: "/room/ihb8ks9z" | "/match"
}
```

* type - set to 'unsub'.
* id - a unique per-client request id (number or string).
* path - the subscription path.

#### Send a message

[client -> server -> client]

Send a message to the server room

```javascript
{
  type: "message",
  id: 1,
  message: {
    type: "message",
    path: "/room/ihb8ks9z"
    message: "hello"
  }
}
```

* type - set to 'message'.
* id - a unique per-client request id (number or string).
* message - an object with:
    * type - type of message
    * path - the room path

The server response:
```javascript
{
  type: "pub",
  path: "/room/ihb8ks9z",
  message: {
    type: "message",
    path: "/room/ihb8ks9z"
    message: "hello"
  }
}
```