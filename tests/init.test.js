import chai from 'chai';
import supertest from 'supertest';
import api from '../server';

global.app = api;
global.request = supertest(api);
global.assert = chai.assert;
global.expect = chai.expect;
