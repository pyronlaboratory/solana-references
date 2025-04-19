import { BN, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { BankrunProvider, startAnchor } from "anchor-bankrun";
import { ProgramTestContext } from "solana-bankrun";
import { Votingdapp } from "../target/types/votingdapp";

const IDL = require("../target/idl/votingdapp.json");

const votingAddress = new PublicKey(
  "coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF"
);

describe("Voting dApp::Test__Suite", () => {
  let context: ProgramTestContext;
  let provider: BankrunProvider;
  let votingProgram: Program<Votingdapp>;

  beforeAll(async () => {
    context = await startAnchor(
      "",
      [{ name: "votingdapp", programId: votingAddress }],
      []
    );
    provider = new BankrunProvider(context);
    votingProgram = new Program<Votingdapp>(IDL, provider);
  });

  it("Initialize Poll", async () => {
    await votingProgram.methods
      .initializePoll(
        new BN(1),
        "UFC 324: Athlete Red v. Athlete Blue: Round 1/3",
        new BN(0),
        new BN(1745061937)
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

  it("Initialize Candidate", async () => {
    await votingProgram.methods
      .initializeCandidate("Nate Diaz", new BN(1))
      .rpc();
    await votingProgram.methods
      .initializeCandidate("Dustin Poirer", new BN(1))
      .rpc();
    const [redCandidateAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from("Nate Diaz"), new BN(1).toArrayLike(Buffer, "le", 8)],
      votingAddress
    );
    const redCandidate = await votingProgram.account.candidate.fetch(
      redCandidateAddress
    );
    const [blueCandidateAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from("Dustin Poirer"), new BN(1).toArrayLike(Buffer, "le", 8)],
      votingAddress
    );
    const blueCandidate = await votingProgram.account.candidate.fetch(
      blueCandidateAddress
    );

    expect(redCandidate.votes.toNumber()).toBe(0);
    expect(blueCandidate.votes.toNumber()).toBe(0);
  });

  it("Vote", async () => {});
});
