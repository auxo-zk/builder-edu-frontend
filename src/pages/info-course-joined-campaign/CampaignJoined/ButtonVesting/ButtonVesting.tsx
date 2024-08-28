import {
    abiCampaign,
    abiGovernor,
    BN,
    ButtonLoading,
    CampaignFundraising,
    contractAddress,
    Course,
    createVesting,
    DEC,
    ErrorExeTransaction,
    formatNumber,
    useModalFunction,
    useSwitchToSelectedChain,
} from '@auxo-dev/frontend-common';
import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { config } from 'src/constants';
import { abiRevenuePoolFactory } from 'src/constants/abi';
import { Address, erc20Abi } from 'viem';
import { readContract, waitForTransactionReceipt } from 'viem/actions';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import axios from 'axios';

export default function ButtonVesting({ campaign, course }: { course: Course; campaign: CampaignFundraising }) {
    const { openModal } = useModalFunction();
    return (
        <Button
            variant="outlined"
            size="small"
            onClick={() =>
                openModal({
                    title: 'Vesting',
                    content: <ModalVesting course={course} campaign={campaign} />,
                    modalProps: { maxWidth: 'xs' },
                })
            }
        >
            Vesting
        </Button>
    );
}

function stringToBytes32(str: string) {
    const utf8 = new TextEncoder().encode(str);
    if (utf8.length > 32) {
        throw new Error('String is too long to convert to bytes32');
    }
    const bytes = new Uint8Array(32);
    bytes.set(utf8);
    return ('0x' +
        Array.from(bytes)
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('')) as `0x${string}`;
}

function ModalVesting({ campaign, course }: { course: Course; campaign: CampaignFundraising }) {
    const [amount, setAmount] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const { chainIdSelected, switchToChainSelected } = useSwitchToSelectedChain();
    const { writeContractAsync } = useWriteContract();
    const { address } = useAccount();
    const [maxVest, setMaxVest] = React.useState(0);

    async function getMaxVest() {
        try {
            const response = await readContract(config.getClient(), {
                abi: abiCampaign,
                address: contractAddress[chainIdSelected].Campaign,
                functionName: 'ableToVestAmount',
                args: [BigInt(campaign.campaignId), course.address],
            });
            console.log(response);
            setMaxVest(Number(response));
        } catch (error) {
            console.error(error);
        }
    }

    async function handleClick() {
        setLoading(true);
        try {
            if (!address) throw new Error('Please connect wallet');

            const dataCreateVesting = await createVesting({
                campaignId: Number(campaign.campaignId),
                governorAddress: course.address,
                amount: Number(amount) * 10 ** campaign.tokenFunding.decimals + '',
            });

            console.log(dataCreateVesting);

            await switchToChainSelected();
            // const allowance = await readContract(config.getClient(), {
            //     abi: erc20Abi,
            //     address: campaign.tokenFunding.address,
            //     functionName: 'allowance',
            //     args: [address, course.revenuePoolFactoryAddress],
            // });
            // if (BN(allowance).isLessThan(BN(amount).times(DEC(campaign.tokenFunding.decimals)))) {
            //     const tx = await writeContractAsync({
            //         abi: erc20Abi,
            //         address: campaign.tokenFunding.address,
            //         functionName: 'approve',
            //         args: [course.revenuePoolFactoryAddress, BigInt(Number(amount) * 10 ** campaign.tokenFunding.decimals)],
            //     });
            //     await waitForTransactionReceipt(config.getClient(), { hash: tx });
            // }
            const tx2 = await writeContractAsync({
                abi: abiGovernor,
                address: course.address,
                functionName: 'propose',
                args: [
                    dataCreateVesting.targets as Address[],
                    dataCreateVesting.values.map((item) => BigInt(item)),
                    dataCreateVesting.calldatas as Address[],
                    stringToBytes32(Number(amount) * 10 ** campaign.tokenFunding.decimals + ''),
                    BigInt(Math.floor(Date.now() / 1000)),
                    BigInt(15*60), // 15m
                ],
            });
            await waitForTransactionReceipt(config.getClient(), { hash: tx2 });
            toast.success('Vesting successfully');
        } catch (error) {
            console.error(error);
            toast.error(<ErrorExeTransaction error={error} />);
        }
        setLoading(false);
    }

    useEffect(() => {
        getMaxVest();
    }, []);
    return (
        <Box>
            <Typography textAlign={'right'}>
                Max: {formatNumber(BN(maxVest).div(DEC(campaign.tokenFunding.decimals)), { fractionDigits: 6 })} {campaign.tokenFunding.symbol}
            </Typography>
            <TextField
                label="Enter amount vesting"
                fullWidth
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                InputProps={{ endAdornment: <Typography>{campaign.tokenFunding.symbol}</Typography> }}
            />

            <ButtonLoading muiProps={{ variant: 'contained', onClick: handleClick, sx: { mt: 3 }, fullWidth: true }} isLoading={loading}>
                Vesting
            </ButtonLoading>
        </Box>
    );
}
