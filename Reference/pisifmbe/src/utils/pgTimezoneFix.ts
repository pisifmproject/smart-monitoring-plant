import pg from "pg";

// typeID timestamp + timestamptz
const TIMESTAMPTZ_OID = 1184;
const TIMESTAMP_OID   = 1114;

// parser: convert ke Date dengan treat timezone correctly
pg.types.setTypeParser(TIMESTAMPTZ_OID, (value) => new Date(value));
pg.types.setTypeParser(TIMESTAMP_OID, (value) => new Date(value));

export {};
