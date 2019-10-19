

class redisHelper {
  constructor(client) {
    this.client = client;
  }

  get(id) {
    return new Promise((resolve, reject) => {
      this.client.hgetall(id, (err, obj) => {
        if (err) {
          return reject(err);
        }
        return resolve(obj);
      });
    });
  }


  set(id, params, expire) {
    return new Promise((resolve, reject) => {
      const stringedId = id.toString();
      this.client.hmset(stringedId, params, (err, reply) => {
          expire  ? this.client.expire(stringedId, expire): null;
        if (err) {
          return reject(err);
        }
      });
      resolve();
    });
  }

  del(id) {
    return new Promise((resolve, reject) => {
      const stringedId = id.toString();

      return this.client.hdel(stringedId, (err, reply) => {
        if(err) return reject(err);
        return resolve()
      })
    })
  }
}

module.exports = redisHelper;
