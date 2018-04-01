var TicTac = artifacts.require("./TicTac.sol");

module.exports = function(deployer) {
  deployer.deploy(TicTac);
};
