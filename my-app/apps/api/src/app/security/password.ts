import argon2 from "argon2";
import { ARGON_HASH_OPTİONS } from "./argon.config";

export const hashPassword = async(password: string) => {
   return argon2.hash(password, ARGON_HASH_OPTİONS)
}

export const verifyPassword = async( hash: string, password: string ) => {
   return argon2.verify(hash, password)
}