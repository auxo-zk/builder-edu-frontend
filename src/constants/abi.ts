export const abiRevenuePoolFactory = [
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner_',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'governor_',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'pool',
                type: 'address',
            },
        ],
        name: 'PoolCreated',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'token',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'createPool',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'poolIndex',
                type: 'uint256',
            },
        ],
        name: 'pool',
        outputs: [
            {
                internalType: 'contract IRevenuePool',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'poolCounter',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'pools',
        outputs: [
            {
                internalType: 'contract IRevenuePool[]',
                name: '',
                type: 'address[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
] as const;