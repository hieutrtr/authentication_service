var jwt = require('../handler/jwt');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
chai.should();

describe("jwt", () => {
  describe("createToken", () => {
    it("should be rejected when missing serect key", () =>{
      return jwt.createLoginToken({}).should.be.rejected.and.eventually.have.property('status',500);
    });
    it("should be rejected when missing required parameter", () =>{
      return jwt.createLoginToken({},'serectkey').should.be.rejected.and.eventually.have.property('status',400);
    });
    it("should be resolved", () =>{
      return jwt.createLoginToken({id:"123",username:'hieu',password:'admin',client:'smartlog'},'serectkey').should.eventually.have.property('token');
    });
  });
});
