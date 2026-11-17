import { expect } from "chai"
import sinon from "sinon";
import { GenericContainer } from "testcontainers"
import { fetchAndSum, sum } from "../src/mathUtils.js"
import { beforeEach } from "mocha";

let container;

before(async function () {
  this.timeout(30000);

  container = await new GenericContainer("alpine")
    .withCommand(["sh", "-c", "sleep 60"])
    .start();

  console.log(`Container iniciado: ${container.getId()}`);
});

after(async function () {
  if(container) {
    await container.stop();
    console.log("Container encerrado");
  }
});

describe('sum', () => {
  it('should add two numbers', () => {
    expect(sum(2, 3)).to.equal(5);
  });

  it('should throw error for non-number inputs', () => {
    expect(() => sum("2", 3)).to.throw('Invalid arguments');
  });
});

describe('fetchAndSum', () => {
  let apiClientStub;

  beforeEach(() => {
    apiClientStub = {
      get: sinon.stub()
    };
  });

  it('must sum if the API returns valid: true', async () => {
    apiClientStub.get.resolves({ valid: true });

    const result = await fetchAndSum(apiClientStub, 2, 3);

    expect(result).to.equal(5);

    expect(apiClientStub.get.calledWith("/validate", {params: {x: 2, y:3}})).to.be.true;
  });
});