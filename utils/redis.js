import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient({
      host: '127.0.0.1',
      port: 6379,
    });

    this.client.on('error', (error) => {
      console.log(`Redis client not connected to server: ${error}`);
    });

    // Promisify the Redis client methods
    this.client.getAsync = promisify(this.client.get).bind(this.client);
    this.client.setAsync = promisify(this.client.set).bind(this.client);
    this.client.delAsync = promisify(this.client.del).bind(this.client);
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    return this.client.getAsync(key);
  }

  async set(key, value, time) {
    await this.client.setAsync(key, value);
    await this.client.expire(key, time);
  }

  async del(key) {
    return this.client.delAsync(key);
  }
}

const redisClient = new RedisClient();

export default redisClient;

