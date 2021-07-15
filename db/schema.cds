namespace assert.check;

using {
    cuid,
    managed
} from '@sap/cds/common';

type MetaStatus : String(10) enum {
    draft;
    released;
};

@assert.unique : {
    name    : [
        status,
        name
    ]
}
entity Packages : cuid, managed {
    key status       : MetaStatus not null @assert.range;
        name         : String(50) not null @assert.format: '^[a-zA-Z0-9.]+$';
        description  : String(100);
};

