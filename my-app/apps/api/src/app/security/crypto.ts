import argon2 from "argon2";
import { ARGON_HASH_OPTİONS } from "./argon.config";

export const hash = async( value: string) => {
    return await argon2.hash(value, ARGON_HASH_OPTİONS)
}

export const verify = async(hashedValue: string, plainValue:string ) => {
    return await argon2.verify(hashedValue, plainValue)
}