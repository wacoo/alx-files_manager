import dbClient from '../../utils/db';
/* eslint-disable import/no-named-as-default */

describe('authController', () => {
  const mockUser = {
    email: 'kaido@beast.com',
    password: 'hyakuju_no_kaido_wano',
  };
  let token = '';

  before(function (done) {
    this.timeout(10000);
    dbClient.usersCollection()
      .then((usersCollection) => {
        usersCollection.deleteMany({ email: mockUser.email })
          .then(() => {
            request.post('/users')
              .send({
                email: mockUser.email,
                password: mockUser.password,
              })
              .expect(201)
              .end((requestErr, res) => {
                if (requestErr) {
                  return done(requestErr);
                }
                expect(res.body.email).to.eql(mockUser.email);
                expect(res.body.id.length).to.be.greaterThan(0);
                done();
              });
          })
          .catch((deleteErr) => done(deleteErr));
      }).catch((connectErr) => done(connectErr));
  });

  describe('gET: /connect', () => {
    it('fails with no "Authorization"', function () {
      return new Promise((done) => {
        this.timeout(5000);
        request.get('/connect')
          .expect(401)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.deep.eql({ error: 'Unauthorized' });
            done();
          });
      });
    });

    it('fails for a non-existent user', function () {
      return new Promise((done) => {
        this.timeout(5000);
        request.get('/connect')
          .auth('foo@bar.com', 'raboof', { type: 'basic' })
          .expect(401)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.deep.eql({ error: 'Unauthorized' });
            done();
          });
      });
    });

    it('fails with a valid email and invalid password', function () {
      return new Promise((done) => {
        this.timeout(5000);
        request.get('/connect')
          .auth(mockUser.email, 'raboof', { type: 'basic' })
          .expect(401)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.deep.eql({ error: 'Unauthorized' });
            done();
          });
      });
    });

    it('fails with an wrong email and valid password', function () {
      return new Promise((done) => {
        this.timeout(5000);
        request.get('/connect')
          .auth('zoro@strawhat.com', mockUser.password, { type: 'basic' })
          .expect(401)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.deep.eql({ error: 'Unauthorized' });
            done();
          });
      });
    });

    it('succeeds for an existing user', function () {
      return new Promise((done) => {
        this.timeout(5000);
        request.get('/connect')
          .auth(mockUser.email, mockUser.password, { type: 'basic' })
          .expect(200)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body.token).to.exist;
            expect(res.body.token.length).to.be.greaterThan(0);
            token = res.body.token;
            done();
          });
      });
    });
  });

  describe('gET: /disconnect', () => {
    it('fails with no "X-Token" header field', function () {
      return new Promise((done) => {
        this.timeout(5000);
        request.get('/disconnect')
          .expect(401)
          .end((requestErr, res) => {
            if (requestErr) {
              return done(requestErr);
            }
            expect(res.body).to.deep.eql({ error: 'Unauthorized' });
            done();
          });
      });
    });

    it('fails for a non-existent user', function () {
      return new Promise((done) => {
        this.timeout(5000);
        request.get('/disconnect')
          .set('X-Token', 'raboof')
          .expect(401)
          .end((requestErr, res) => {
            if (requestErr) {
              return done(requestErr);
            }
            expect(res.body).to.deep.eql({ error: 'Unauthorized' });
            done();
          });
      });
    });

    it('succeeds with a valid "X-Token" field', () => new Promise((done) => {
      request.get('/disconnect')
        .set('X-Token', token)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.deep.eql({});
          expect(res.text).to.eql('');
          expect(res.headers['content-type']).to.not.exist;
          expect(res.headers['content-length']).to.not.exist;
          done();
        });
    }));
  });
});
