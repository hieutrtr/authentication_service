import chai from 'chai';
import chaiAsPromised from 'chai-as-promised'
import JWT from '../handler/jwt'

chai.use(chaiAsPromised);
chai.should();

describe("jwt", () => {
  var payload;
  var jwt;
  var redisInfo;

  before(() => {
    jwt = new JWT()
  });

  beforeEach(() => {
    payload = {
      id:"a86d9a60-41c8-11e8-9325-213976427b99",
      username: "therock",
      password_hash: "ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f"
    }
    redisInfo = {
      port: 6379,
      host: 'localhost'
    }
  });
  describe("connect", () => {
    it("should have error when redisInfo.port is undefined", () => {
      delete redisInfo.port
      return JWT.connect("key",redisInfo).should.be.rejected.and.eventually.have.property('error');
    });
    it("should have error when redisInfo.host is undefined", () => {
      delete redisInfo.host
      return JWT.connect("key",redisInfo).should.be.rejected.and.eventually.have.property('error');
    });
    it("should have error when redisInfo.port is empty", () => {
      delete redisInfo.port
      return JWT.connect("key",redisInfo).should.be.rejected.and.eventually.have.property('error');
    });
    it("should have error when redisInfo.host is empty", () => {
      delete redisInfo.host
      return JWT.connect("key",redisInfo).should.be.rejected.and.eventually.have.property('error');
    });
  });
  describe("createLoginToken", () => {
    it("should have error when id is undefined", () => {
      delete payload.id
      return jwt.createLoginToken(payload).should.be.rejected.and.eventually.have.property('error');
    });
    it("should have error when username is undefined", () => {
      delete payload.username
      return jwt.createLoginToken(payload).should.be.rejected.and.eventually.have.property('error');
    });
    it("should have error when password_hash is undefined", () => {
      delete payload.password_hash
      return jwt.createLoginToken(payload).should.be.rejected.and.eventually.have.property('error');
    });
    it("should have error when id is empty", () => {
      payload.id = ''
      return jwt.createLoginToken(payload).should.be.rejected.and.eventually.have.property('error');
    });
    it("should have error when username is empty", () => {
      payload.username = ''
      return jwt.createLoginToken(payload).should.be.rejected.and.eventually.have.property('error');
    });
    it("should have error when password_hash is empty", () => {
      payload.password_hash = ''
      return jwt.createLoginToken(payload).should.be.rejected.and.eventually.have.property('error');
    });
  });
  describe("refreshToken", () => {
    it("should have error when id is undefined", () => {
      delete payload.id
      return jwt.refreshToken(payload).should.be.rejected.and.eventually.have.property('error');
    });
    it("should have error when username is undefined", () => {
      delete payload.username
      return jwt.refreshToken(payload).should.be.rejected.and.eventually.have.property('error');
    });
    it("should have error when refreshToken is undefined", () => {
      delete payload.username
      return jwt.refreshToken(payload).should.be.rejected.and.eventually.have.property('error');
    });
    it("should have error when id is empty", () => {
      payload.id = ''
      return jwt.refreshToken(payload).should.be.rejected.and.eventually.have.property('error');
    });
    it("should have error when username is empty", () => {
      payload.username = ''
      return jwt.refreshToken(payload).should.be.rejected.and.eventually.have.property('error');
    });
    it("should have error when refreshToken is empty", () => {
      payload.username = ''
      return jwt.refreshToken(payload,"").should.be.rejected.and.eventually.have.property('error');
    });
  });
  describe("revokeToken", () => {
    it("should have error when id is undefined", () => {
      delete payload.id
      return jwt.revokeToken(payload).should.be.rejected.and.eventually.have.property('error');
    });
    it("should have error when refreshToken is undefined", () => {
      delete payload.username
      return jwt.revokeToken(payload).should.be.rejected.and.eventually.have.property('error');
    });
    it("should have error when id is empty", () => {
      payload.id = ''
      return jwt.revokeToken(payload).should.be.rejected.and.eventually.have.property('error');
    });
    it("should have error when refreshToken is empty", () => {
      payload.username = ''
      return jwt.revokeToken(payload,"").should.be.rejected.and.eventually.have.property('error');
    });
  });
});
