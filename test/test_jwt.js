var jwt = require('../handler/jwt');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
chai.should();
describe("jwt", function() {
  describe("createToken", function() {
    it("should be rejected when missing serect key", function(){
      return jwt.createLoginToken({}).should.be.rejected.and.eventually.have.property('status',500);
    });
      it("should be rejected when missing required parameter", function(){
        return jwt.createLoginToken({},'serectkey').should.be.rejected.and.eventually.have.property('status',400);
      });
      it("should be resolved", function(){
        return jwt.createLoginToken({user:'hieu',role:'admin',client:'smartlog'},'serectkey').should.eventually.have.property('token');
      });
  });
});
