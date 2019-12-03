Symfony Socket.io bundle
========================

[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/sfcod/socketio/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/sfcod/socketio/?branch=master)[![Code Climate](https://codeclimate.com/github/sfcod/socketio/badges/gpa.svg)](https://codeclimate.com/github/sfcod/socketio)

Use all power of socket.io in your Symfony project.

#### Config

###### Install node + additional npm
```bash
    cd ~
    curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh
    sudo bash nodesource_setup.sh
    cd vendor/sfcod/soketio/server
    npm install
```

```yaml
sfcod_socketio:
    namespaces:
        - 'App\SocketIo\Publisher'
        - 'App\SocketIo\Subscriber'
```
```dotenv
###> socketio config ###
SOCKET_IO_WS_SERVER=localhost:1358
SOCKET_IO_WS_CLIENT=localhost:1358
SOCKET_IO_SSL='' || '{"key":"path to key", "cert":"path to cert"}'
SOCKET_IO_NSP=redis
###< socketio config ###
```

#### Usage

###### Start nodejs server
```bash
    php bin/console socket-io:node-js-server
```
###### Start php server
```bash
    php bin/console socket-io:php-server
```

###### Create publisher from server to client
```php
    use SfCod\SocketIoBundle\Events\EventInterface;
    use SfCod\SocketIoBundle\Events\EventPublisherInterface;
    use SfCod\SocketIoBundle\Events\AbstractEvent;
    
    class CountEvent extends AbstractEvent implements EventInterface, EventPublisherInterface
    {
        /**
         * Changel name. For client side this is nsp.
         */
        public static function broadcastOn(): array
        {
            return ['notifications'];
        }
    
        /**
         * Event name
         */
        public static function name(): string
        {
            return 'update_notification_count';
        }
            
        /**
         * Emit client event
         * @return array
         */
        public function fire(): array
        {
            return [
                'count' => 10,
            ];
        }
    }
```
```js
    var socket = io('{your_host_address}:1367/notifications');
    socket.on('update_notification_count', function(data){
        console.log(data)
    });
```

###### Create receiver from client to server
```php
    use SfCod\SocketIoBundle\Events\EventInterface;
    use SfCod\SocketIoBundle\Events\EventSubscriberInterface;
    use SfCod\SocketIoBundle\Events\AbstractEvent;
    
    class MarkAsReadEvent extends AbstractEvent implements EventInterface, EventSubscriberInterface
    {
        /**
         * Changel name. For client side this is nsp.
         */
        public static function broadcastOn(): array
        {
            return ['notifications'];
        }
    
        /**
         * Event name
         */
        public static function name(): string
        {
            return 'mark_as_read_notification';
        }
            
        /**
         * Emit client event
         * @return array
         */
        public function handle(
        {
            // Mark notification as read
            // And call client update
            $this->container->get(Broadcast::class)->emit('update_notification_count', ['some key' => 'some value']);
        }
    }
```

```js
    var socket = io('{your_host_address}:1367/notifications');
    socket.emit('mark_as_read_notification', {id: 10});
```

You can have publisher and receiver in one event. If you need check data from client to server you should use: 
- EventPolicyInterface

###### Receiver with checking from client to server
```php
    use SfCod\SocketIoBundle\Events\EventSubscriberInterface;
    use SfCod\SocketIoBundle\Events\EventInterface;
    use SfCod\SocketIoBundle\Events\EventPolicyInterface;
    use SfCod\SocketIoBundle\Events\AbstractEvent;
    
    class MarkAsReadEvent extends AbstractEvent implements EventInterface, EventSubscriberInterface, EventPolicyInterface
    {
        /**
         * Changel name. For client side this is nsp.
         */
        public static function broadcastOn(): array
        {
            return ['notifications'];
        }
    
        /**
         * Event name
         */
        public static function name(): string
        {
            return 'mark_as_read_notification';
        }
         
        public function can($data): bool
        {
            // Check data from client    
            return true;
        }        
        
        /**
         * Emit client event
         * @return array
         */
        public function handle()
        {
            // Mark notification as read
            // And call client update
            $this->container->get(Broadcast::class)->emit('update_notification_count', ['some key' => 'some value']);
        }
    }
```

Socket.io has room functional. If you need it, you should implement:
- EventRoomInterface
```php
    use SfCod\SocketIoBundle\Events\EventPubscriberInterface;
    use SfCod\SocketIoBundle\Events\EventInterface;
    use SfCod\SocketIoBundle\Events\EventRoomInterface;
    
    class CountEvent extends AbstractEvent implements EventInterface, EventPubscriberInterface, EventRoomInterface
    {           
        /**
         * Changel name. For client side this is nsp.
         */
        public static function broadcastOn(): array
        {
            return ['notifications'];
        }
    
        /**
         * Event name
         */
        public static function name(): string
        {
            return 'update_notification_count';
        }
           
        /**
         * Socket.io room
         * @return string
         */
        public function room(): string
        {
            return 'user_id_' . $this->>userId;
        }            
            
        /**
         * Emit client event
         * @return array
         */
        public function fire(): array
        {                        
            return [
                'count' => 10,
            ];
        }
    }
```

```js
    var socket = io('{your_host_address}:1367/notifications');
    socket.emit('join', {room: 'user_id_10'});
    // Now you will receive data from 'room-1'
    socket.on('update_notification_count', function(data){
        console.log(data)
    });
    // You can leave room
    socket.emit('leave');
```
Only user with id 10 will receive data
```php
$this->container->get(Broadcast::class)->emit('update_notification_count', ['some key' => 'some value', 'userId' => 10]);
```
