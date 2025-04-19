#![allow(clippy::result_large_err)]
#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;
declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");
pub const ANCHOR_DISCRIMATOR_SIZE: usize = 8;
#[program]
pub mod votingdapp {
    use super::*;
    pub fn initialize_poll(
        ctx: Context<InitializePoll>,
        poll_id: u64,
        poll_description: String,
        poll_start: u64,
        poll_end: u64,
        poll_candidate_amount: u64,
    ) -> Result<()> {
        let poll: &mut Account<'_, Poll> = &mut ctx.accounts.poll;
        poll.id = poll_id;
        poll.description = poll_description;
        poll.start = poll_start;
        poll.end = poll_end;
        poll.candidate_amount = poll_candidate_amount;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(poll_id: u64)]
pub struct InitializePoll<'info> {
    #[account(mut)]
    user: Signer<'info>,
    #[account(
        init,
        payer = user,
        space = ANCHOR_DISCRIMATOR_SIZE + Poll::INIT_SPACE,
        seeds = [poll_id.to_le_bytes().as_ref()],
        bump
    )]
    poll: Account<'info, Poll>,
    system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Poll {
    pub id: u64,
    #[max_len(280)]
    pub description: String,
    pub start: u64,
    pub end: u64,
    pub candidate_amount: u64,
}
