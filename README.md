# Solana Natural Number Sum (sBPF Assembly)

A minimal Solana program written in low-level sBPF Assembly to compute the sum of the first `n` natural numbers.

This program is optimized for compute unit (CU) efficiency and includes overflow detection to ensure safe usage of 64-bit unsigned integers (`u64`).

Program ID: ASMf7dX79v4r8y3rGSepW3LuHCtngvoU7sWL65inTZUC
https://explorer.solana.com/address/ASMf7dX79v4r8y3rGSepW3LuHCtngvoU7sWL65inTZUC?cluster=devnet

---


##  Purpose

To compute the sum:
sum(n) = 1 + 2 + ... + n = n(n+1)/2

- Written entirely in Solana sBPF Assembly.
- Optimized for compute unit cost.
- Includes overflow detection at both input and summation level.

---

## Implementation Details

- Language: Solana sBPF Assembly
- Instruction data: Accepts `n` as a single byte (`u8`)
- Max allowed input: `n ≤ 6,074,000,999`  
  This is the largest `n` such that `sum(n)` fits in `u64`.

- Overflow is handled explicitly:
  - Input > 6,074,000,999 is rejected.
