import chai from 'chai';
import chaiAsPromised from 'chai-as-promised'
import Mysql from '../handler/mysql'


chai.use(chaiAsPromised);
chai.should();
describe("mysql", () => {
  var mysql
  before(() => {
    mysql = new Mysql()
  });

  describe("syncModels", () => {
    it("should have error when missing host", () =>{
      return Mysql.connect({}).should.be.rejected.and.eventually.have.property('error');
    });
    it("should have error when missing database", () =>{
      return Mysql.connect({host:'localhost'}).should.be.rejected.and.eventually.have.property('error');
    });
    it("should have error when host is empty", () =>{
      return Mysql.connect({host:'', database:'', user: '', password: ''}).should.be.rejected.and.eventually.have.property('error');
    });
  });
  describe("refreshLogin", () => {
    it("should have error when accountId is undefined", () =>{
      return mysql.refreshLogin().should.be.rejected.and.eventually.have.property('error');
    });
    it("should have error when accountId is empty", () =>{
      return mysql.refreshLogin().should.be.rejected.and.eventually.have.property('error');
    });
  });
  describe("setRole", () => {
    it("should have error when policyName is undefined", () =>{
      return mysql.setRole({accountId:"a86d9a60-41c8-11e8-9325-213976427b99"}).should.be.rejected.and.eventually.have.property('error');
    });
      it("should have error when policyName is empty", () =>{
        return mysql.setRole({accountId:"a86d9a60-41c8-11e8-9325-213976427b99",policyName:""}).should.be.rejected.and.eventually.have.property('error');
      });
    it("should have error when accountId is undefined", () =>{
      return mysql.setRole({policyName:"admin"}).should.be.rejected.and.eventually.have.property('error');
    });
    it("should have error when accountId is empty", () =>{
      return mysql.setRole({policyName:"admin",accountId:""}).should.be.rejected.and.eventually.have.property('error');
    });
  });
  describe("login", () => {
    it("should have error when username is undefined", () =>{
      return mysql.setRole({password:"12345678"}).should.be.rejected.and.eventually.have.property('error');
    });
    it("should have error when username is empty", () =>{
      return mysql.setRole({username:"",password:"12345678"}).should.be.rejected.and.eventually.have.property('error');
    });
    it("should have error when password is undefined", () =>{
      return mysql.setRole({username:"therock"}).should.be.rejected.and.eventually.have.property('error');
    });
    it("should have error when password is empty", () =>{
      return mysql.setRole({username:"therock",password:""}).should.be.rejected.and.eventually.have.property('error');
    });
  });
});
