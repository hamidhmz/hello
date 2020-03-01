'use strict';
const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const config = require('config');
const redisUrl = config.get('redis');
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;
mongoose.Query.prototype.cache = function(options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');

    return this;
};

mongoose.Query.prototype.exec = async function() {
    if (!this.useCache) {
        return exec.apply(this, arguments);
    }
    // this would be current query
    // console.log('--RUN ONE QUERY--');
    // console.log(this.getQuery())
    // console.log(this.mongooseCollection.name);
    const key = JSON.stringify(
        Object.assign({}, this.getQuery(), {
            collection: this.mongooseCollection.name
        })
    );
    // console.log(key);
    const cacheValue = await client.hget(this.hashKey, key);
    if (cacheValue) {
        const doc = JSON.parse(cacheValue);
        return Array.isArray(doc)
            ? doc.map(d => new this.mode(d))
            : new this.model(doc);
    }

    const result = await exec.apply(this, arguments);
    client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10);
    return result;
};

/* -------------------------------------------------------------------------- */
/*                                    usage                                   */
/* -------------------------------------------------------------------------- */

//const blogs = await Blog.find({_user:req.user.id}).cache({
// key:req.user.id
//})

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey));
    }
};
