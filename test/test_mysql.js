var db = require('../handler/mysql');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
chai.should();

describe("mysql", function() {
  describe("connect", function() {
    it("should have error when missing host", function(){
      return db.connect({}).should.have.property('error');
    });
  });
  describe("connect", function() {
    it("should have error when missing database", function(){
      return db.connect({host:'localhost'}).should.have.property('error');
    });
  });
  describe("connect", function() {
    it("should be object with keys", function(){
      return db.connect({host:'localhost', database:'sml_ua', user: 'hieutt', password: 'pass'}).should.have.keys('register','login','logout');
    });
  });
});
