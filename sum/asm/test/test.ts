import {
    ComputeBudgetProgram,
    Connection,
    Keypair,
    Transaction,
    TransactionInstruction,
    TransactionInstructionCtorFields
} from "@solana/web3.js";

import { assert } from "chai";

const signerSeed = JSON.parse(process.env.SIGNER);
const programSeed = require("../ASMf7dX79v4r8y3rGSepW3LuHCtngvoU7sWL65inTZUC.json");

const programKeypair = Keypair.fromSecretKey(new Uint8Array(programSeed));
const program = programKeypair.publicKey;

const connection = new Connection("https://api.devnet.solana.com", {
    commitment: "confirmed"
});
const signer = Keypair.fromSecretKey(new Uint8Array(signerSeed));

const confirm = async (signature: string): Promise<string> => {
    const block = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
        signature,
        ...block
    });
    return signature;
};

const getLogs = async (signature: string): Promise<string[]> => {
    const tx = await connection.getTransaction(signature, {
        commitment: "confirmed"
    });
    return tx.meta.logMessages;
};

const signAndSend = async (tx: Transaction): Promise<string> => {
    const block = await connection.getLatestBlockhash();
    tx.recentBlockhash = block.blockhash;
    tx.lastValidBlockHeight = block.lastValidBlockHeight;
    const signature = await connection.sendTransaction(tx, [signer]);
    return signature;
};

const sumTx = (n: number): Transaction => {
    const tx = new Transaction();
    tx.instructions.push(
        ComputeBudgetProgram.setComputeUnitLimit({ units: 2000 }),
        new TransactionInstruction({
            keys: [
                {
                    pubkey: signer.publicKey,
                    isSigner: true,
                    isWritable: true
                }
            ],
            programId: program,
            data: Buffer.from([n & 0xff]) // send `n` as one byte
        } as TransactionInstructionCtorFields)
    );
    return tx;
};

const toLogHex = (value: bigint | number): string => {
    const hex = BigInt(value).toString(16);
    return `Program log: 0x${hex}, 0x0, 0x0, 0x0, 0x0`;
};

describe("Natural number sum tests", function () {
    this.timeout(0); // disables timeout for all tests here
    it("sum(0) = 0", async () => {
        const logs = await signAndSend(sumTx(0)).then(confirm).then(getLogs);
        assert.equal(logs[3], toLogHex(0));
    });

    it("sum(1) = 1", async () => {
        const logs = await signAndSend(sumTx(1)).then(confirm).then(getLogs);
        assert.equal(logs[3], toLogHex(1));
    });

    it("sum(5) = 15", async () => {
        const logs = await signAndSend(sumTx(5)).then(confirm).then(getLogs);
        assert.equal(logs[3], toLogHex(15));
    });

    it("sum(10) = 55", async () => {
        const logs = await signAndSend(sumTx(10)).then(confirm).then(getLogs);
        assert.equal(logs[3], toLogHex(55));
    });

    it("sum(100) = 5050", async () => {
        const logs = await signAndSend(sumTx(100)).then(confirm).then(getLogs);
        assert.equal(logs[3], toLogHex(5050));
    });

    it("sum(255) = 32640", async () => {
        const logs = await signAndSend(sumTx(255)).then(confirm).then(getLogs);
        assert.equal(logs[3], toLogHex((255 * 256) / 2));
    });
});
