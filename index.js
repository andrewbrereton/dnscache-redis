var redis = require('redis');

var dnsCacheRedis = function dnsCacheRedis(config) {
    var redisKey = 'dnscache:';
    var redisClient = redis.createClient(config.redis || {});

    config.ttl = config.ttl || 43200 // Cache for 12 hours

    this.set = function(key, value, callback) {
        console.log('SET ' + redisKey + key + ' = ' + JSON.stringify(value));

        redisClient.set(redisKey + key, JSON.stringify(value), 'NX', 'EX', config.ttl, function(err) {
            if (callback) {
                callback(err, value);
            }
        });
    };

    this.get = function(key, callback) {
        console.log('GET ' + redisKey + key);

        redisClient.get(redisKey + key, function(err, item) {
            if (callback) {
                callback(err, JSON.parse(item));
            }
        });
    };
};

module.exports = dnsCacheRedis;