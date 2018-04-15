var db = require('../handler/mysql');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var conn
chai.use(chaiAsPromised);
chai.should();

describe("mysql", () => {
  describe("connect", () => {
    it("should have error when missing host", () =>{
      return db.connect({}).should.have.property('error');
    });
    it("should have error when missing database", () =>{
      return db.connect({host:'localhost'}).should.have.property('error');
    });
    it("should have error when host is empty", () =>{
      return db.connect({host:'', database:'', user: '', password: ''}).should.have.property('error');
    });
  });
});
