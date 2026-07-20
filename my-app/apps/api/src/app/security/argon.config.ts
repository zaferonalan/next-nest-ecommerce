import argon2, { type HashOptions } from "argon2";

export const ARGON_HASH_OPTİONS : HashOptions = {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 2,
}

