import { dbClient } from '../../utils/db';
/* eslint-disable import/no-named-as-default */

describe('appController', () => {
  before(function (done) {
    this.timeout(10000);
    Promise.all([dbClient.usersCollection(), dbClient.filesCollection()])
      .then(([usersCollection, filesCollection]) => {
        Promise.all([usersCollection.deleteMany({}), filesCollection.deleteMany({})])
          .then(() => done())
          .catch((deleteErr) => done(deleteErr));
      }).catch((connectErr) => done(connectErr));
  });

  describe('gET: /status', () => {
    it('+ Services are online', () => new Promise((done) => {
      request.get('/status')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.deep.eql({ redis: true, db: true });
          done();
        });
    }));
  });

  describe('gET: /stats', () => {
    it('+ Correct statistics about db collections', () => new Promise((done) => {
      request.get('/stats')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.deep.eql({ users: 0, files: 0 });
          done();
        });
    }));

    it('check correct statistics about db collections [alt]', function () {
      return new Promise((done) => {
        this.timeout(10000);
        Promise.all([dbClient.usersCollection(), dbClient.filesCollection()])
          .then(([usersCollection, filesCollection]) => {
            Promise.all([
              usersCollection.insertMany([{ email: 'john@mail.com' }]),
              filesCollection.insertMany([
                { name: 'foo.txt', type: 'file' },
                { name: 'pic.png', type: 'image' },
              ]),
            ])
              .then(() => {
                request.get('/stats')
                  .expect(200)
                  .end((err, res) => {
                    if (err) {
                      return done(err);
                    }
                    expect(res.body).to.deep.eql({ users: 1, files: 2 });
                    done();
                  });
              })
              .catch((deleteErr) => done(deleteErr));
          }).catch((connectErr) => done(connectErr));
      });
    });
  });
});
