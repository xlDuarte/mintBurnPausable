const { expect } = require("chai");
const { ethers } = require("hardhat");

    let Token;
    let hardhatToken;
    let ownerBalance;
    let owner;
    let addr1;
    let addr2;
    let addrs;

beforeEach(async function () {
    Token = await ethers.getContractFactory("CryptoToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    hardhatToken = await Token.deploy(1000);
    ownerBalance = await hardhatToken.balanceOf(owner.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      // Expects the owner variable stored in the contract to be equal to our Signer's owner.
      expect(await hardhatToken.getOwner()).to.equal(owner.address);
    });
});

describe("Token TotalSupply", function () {
    it("Deployment should assign the total supply of tokens to the totalSupply", async function () {
      const totalSupplyExpected = 1000;
      console.log("TotalSuply value: " +  await hardhatToken.totalSupply());
      console.log("TotalSuplyExpected value: " + totalSupplyExpected);
      expect(await hardhatToken.totalSupply()).to.equal(totalSupplyExpected);
    });
  });

describe("Token contract", function () {
    it("Deployment should assign the total supply of tokens to the owner", async function () {
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("BalanceOf", function() {
  it("Tests the function balanceOf(), should update balances after transfers", async function () {
    const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

    expect(await hardhatToken.balanceOf(addr1.address)).to.equal(0);
    expect(await hardhatToken.balanceOf(addr2.address)).to.equal(0);

    // Transfer 100 tokens from owner to addr1.
    await hardhatToken.transfer(addr1.address, 100);

    // Transfer another 50 tokens from owner to addr2.
    await hardhatToken.transfer(addr2.address, 50);

    // Check balances.
    const finalOwnerBalance = await hardhatToken.balanceOf(owner.address);
    expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

    
    const addr1Balance = await hardhatToken.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(100);

    const addr2Balance = await hardhatToken.balanceOf(addr2.address);
    expect(addr2Balance).to.equal(50);
  });
});  
  
  describe("Transactions 1", function() {
    it("Should transfer tokens between accounts", async function() {
      // Transfer 50 tokens from owner to addr1
      await hardhatToken.transfer(addr1.address, 50);
      expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50);
      console.log("Addr1 Address, before: " + addr1.address + " balance: " + await hardhatToken.balanceOf(addr1.address));
      
      // Transfer 50 tokens from addr1 to addr2
      await hardhatToken.connect(addr1).transfer(addr2.address, 50);
      expect(await hardhatToken.balanceOf(addr2.address)).to.equal(50);
      
      //Addr1, subtraction of 50 is expected, resulting in the value 0
      expect(await hardhatToken.balanceOf(addr1.address)).to.equal(0);
      console.log("Addr1 Address, after: " +  addr1.address + " balance: " + await hardhatToken.balanceOf(addr1.address));
      console.log("Addr2 Address: " + addr2.address + " balance: " + await hardhatToken.balanceOf(addr2.address));
    });
  });  

  describe("Transactions 2", function() {
    it("Transfer tokens to the addr1 account and subtract the transferred amount from the owner account.", async function() {
      // Transfer 50 tokens from owner to addr1
      await hardhatToken.transfer(addr1.address, 50);
      expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50);
      console.log("Owner Address, before: " + owner.address + " balance: " + await hardhatToken.balanceOf(owner.address));
      
      //Addr1, subtraction of 50 is expected, resulting in the value 0
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(950);
      console.log("Addr1 Address, after: " +  addr1.address + " balance: " + await hardhatToken.balanceOf(addr1.address));
    });
  }); 

  describe("Transactions 3", function() {
  it("Should fail if sender doesn’t have enough tokens", async function () {
    const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);
    await expect(hardhatToken.connect(addr1).transfer(owner.address, 1)).to.be.reverted;
    expect(await hardhatToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
  });
});

describe("Transactions mint sum", function() {
  it("The totalSuply value and the Owner's wallet value must receive the new value.", async function () {
    await hardhatToken.mint(owner.address, 50);
    expect(await hardhatToken.totalSupply()).to.equal(1050);
    expect(await hardhatToken.balanceOf(owner.address)).to.equal(1050);
  });
});

describe("Transactions mint equal values ", function() {
  it("The value of totalSuply and the value of the Owner's portfolio must be equal.", async function () {
    await hardhatToken.mint(owner.address, 50);
    expect(await hardhatToken.balanceOf(owner.address)).to.equal( await hardhatToken.totalSupply());
  });
});

describe("Transactions burn sub", function() {
  it("The totalSuply value and the Owner's wallet value must receive the new value.", async function () {
    await hardhatToken.burn(50);
    expect(await hardhatToken.totalSupply()).to.equal(950);
    expect(await hardhatToken.balanceOf(owner.address)).to.equal(950);
  });
});

describe("Transactions burn equal values ", function() {
  it("The value of totalSuply and the value of the Owner's portfolio must be equal.", async function () {
    //const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);
    //const initialTotalSupply = await hardhatToken.totalSupply();
    await hardhatToken.mint(owner.address, 50);
    expect(await hardhatToken.balanceOf(owner.address)).to.equal( await hardhatToken.totalSupply());
  });
});

//Pegar
describe("Transactions setAddressToBalanceSum", function() {
  it("The adr wallet value must receive the added value.", async function () {
    await hardhatToken.setAddressToBalanceSum(addr1.address, 50);
    expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50);
    expect(await hardhatToken.totalSupply()).to.equal(1050);
  });
});

describe("Transactions setAddressToBalanceSub", function() {
  it("The adr wallet value must receive the added value.", async function () {
    //await hardhatToken.setAddressToBalanceSum(addr1.address, 50);
    //console.log("valor aqui antes: " +  await hardhatToken.balanceOf(addr1.address));
    await hardhatToken.setAddressToBalanceSub(50);
    //console.log("valor aqui depois: " + await hardhatToken.balanceOf(addr1.address));
    expect(await hardhatToken.balanceOf(owner.address)).to.equal(950);
    expect(await hardhatToken.totalSupply()).to.equal(950);
  });
});

describe("Pause contract", function() {
  it("Testa se o contrato inteiro foi pausado, impedindo novas tranzações", async function () {
    
    await expect(await hardhatToken.isPaused()).to.equal(false);
    hardhatToken.pause();
    await expect(await hardhatToken.isPaused()).to.equal(true);

    await expect(hardhatToken.mint(owner.address, 50)).to.be.reverted;
    await expect(hardhatToken.burn(50)).to.be.reverted;
    await expect(hardhatToken.pause()).to.be.reverted;
    await expect(hardhatToken.setAddressToBalanceSum(addr1.address, 50)).to.be.reverted;
    await expect(hardhatToken.setAddressToBalanceSub(50)).to.be.reverted;
    await expect(hardhatToken.transfer(addr1.address, 50)).to.be.reverted;
    await expect(hardhatToken.balanceOf(owner.address)).to.be.reverted;
    await expect(hardhatToken.totalSupply()).to.be.reverted;
  });
});

describe("UnPause contract", function() {
  it("Testa se o contrato inteiro foi pausado, impedindo novas tranzações", async function () {
    
    await expect(await hardhatToken.isPaused()).to.equal(false);
    hardhatToken.pause();
    await expect(await hardhatToken.isPaused()).to.equal(true);
    hardhatToken.unPause();
    await expect(await hardhatToken.isPaused()).to.equal(false);

    await expect(hardhatToken.mint(owner.address, 50)).to.be.not.reverted;
    await expect(hardhatToken.burn(50)).to.be.not.reverted;
    await expect(hardhatToken.setAddressToBalanceSum(addr1.address, 50)).to.be.not.reverted;
    await expect(hardhatToken.setAddressToBalanceSub(50)).to.be.not.reverted;
    await expect(hardhatToken.transfer(addr1.address, 50)).to.be.not.reverted;
    await expect(hardhatToken.balanceOf(owner.address)).to.be.not.reverted;
    await expect(hardhatToken.totalSupply()).to.be.not.reverted;
  });
});


