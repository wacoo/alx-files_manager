import { expect } from 'chai';
import redisClient from '../../utils/redis';
/* eslint-disable import/no-named-as-default */

describe('check RedisClient', () => {
  before(function (done) {
    this.timeout(10000);
    setTimeout(done, 4000);
  });

  it('check connection', () => {
    expect(redisClient.isAlive()).to.equal(true);
  });

  it('check saving and getting values', async () => {
    await redisClient.set('test_key', 345, 10);
    expect(await redisClient.get('test_key')).to.equal('345');
  });

  it('check expired value', async () => {
    await redisClient.set('test_key', 356, 1);
    setTimeout(async () => {
      expect(await redisClient.get('test_key')).to.not.equal('356');
    }, 2000);
  });

  it('check deleted value', async () => {
    await redisClient.set('test_key', 345, 10);
    await redisClient.del('test_key');
    setTimeout(async () => {
      console.log('del: test_key ->', await redisClient.get('test_key'));
      expect(await redisClient.get('test_key')).to.be.null;
    }, 2000);
  });
});
