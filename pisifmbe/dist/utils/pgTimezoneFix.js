"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = __importDefault(require("pg"));
// typeID timestamp + timestamptz
const TIMESTAMPTZ_OID = 1184;
const TIMESTAMP_OID = 1114;
// parser: convert ke Date dengan treat timezone correctly
pg_1.default.types.setTypeParser(TIMESTAMPTZ_OID, (value) => new Date(value));
pg_1.default.types.setTypeParser(TIMESTAMP_OID, (value) => new Date(value));
