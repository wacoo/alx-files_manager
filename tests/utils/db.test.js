import dbClient from '../../utils/db';
/* eslint-disable import/no-named-as-default */

describe('check DBClient', () => {
  before(function (done) {
    this.timeout(10000);
    Promise.all([dbClient.usersCollection(), dbClient.filesCollection()])
      .then(([usersCollection, filesCollection]) => {
        Promise.all([usersCollection.deleteMany({}), filesCollection.deleteMany({})])
          .then(() => done())
          .catch((deleteErr) => done(deleteErr));
      }).catch((connectErr) => done(connectErr));
  });

  it('+ Client connection', () => {
    expect(dbClient.isAlive()).to.equal(true);
  });

  it('check nbUsers', async () => {
    expect(await dbClient.nbUsers()).to.equal(0);
  });

  it('check nbFiles', async () => {
    expect(await dbClient.nbFiles()).to.equal(0);
  });
});
