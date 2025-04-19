import { BN, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { BankrunProvider, startAnchor } from "anchor-bankrun";
import { Votingdapp } from "../target/types/votingdapp";

const IDL = require("../target/idl/votingdapp.json");

const votingAddress = new PublicKey(
  "coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF"
); // smart contract address

describe("Voting dApp::Test__Suite", () => {
  it("Initialize Poll", async () => {
    const context = await startAnchor(
      "",
      [{ name: "votingdapp", programId: votingAddress }],
      []
    );
    const provider = new BankrunProvider(context);
    const votingProgram = new Program<Votingdapp>(IDL, provider);
    await votingProgram.methods
      .initializePoll(
        new BN(1),
        "UFC 324: Athlete Red v. Athlete Blue: Round 1/3",
        new BN(0),
        new BN(1745061937),
        new BN(2)
      )
      .rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new BN(1).toArrayLike(Buffer, "le", 8)],
      votingAddress
    );
    const poll = await votingProgram.account.poll.fetch(pollAddress);
    expect(poll.id.toNumber()).toBe(1);
    expect(poll.description).toEqual(
      "UFC 324: Athlete Red v. Athlete Blue: Round 1/3"
    );
    expect(poll.start.toNumber()).toBeLessThan(poll.end.toNumber());
  });
});
