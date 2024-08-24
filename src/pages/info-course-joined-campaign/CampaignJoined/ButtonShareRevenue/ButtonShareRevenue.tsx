import { BN, ButtonLoading, Campaign, CampaignFundraising, Course, DEC, ErrorExeTransaction, useModalFunction, useSwitchToSelectedChain } from '@auxo-dev/frontend-common';
import { Box, TextField, Typography } from '@mui/material';
import React from 'react';
import { toast } from 'react-toastify';
import { config } from 'src/constants';
import { abiRevenuePoolFactory } from 'src/constants/abi';
import { erc20Abi } from 'viem';
import { readContract, waitForTransactionReceipt } from 'viem/actions';
import { useAccount, useWriteContract } from 'wagmi';

export default function ButtonShareRevenue({ campaign, course }: { course: Course; campaign: CampaignFundraising }) {
    const { openModal } = useModalFunction();
    return (
        <ButtonLoading
            muiProps={{
                variant: 'outlined',
                size: 'small',
                color: 'secondary',
                onClick: () => {
                    openModal({
                        title: 'Share Revenue',
                        content: <ModalShareRevenue course={course} campaign={campaign} />,
                        modalProps: { maxWidth: 'xs' },
                    });
                },
            }}
            isLoading={false}
        >
            Share Revenue
        </ButtonLoading>
    );
}

function ModalShareRevenue({ campaign, course }: { course: Course; campaign: CampaignFundraising }) {
    const [amount, setAmount] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const { chainIdSelected, switchToChainSelected } = useSwitchToSelectedChain();
    const { writeContractAsync } = useWriteContract();
    const { address } = useAccount();

    async function handleShareRevenue() {
        setLoading(true);
        try {
            if (!address) throw new Error('Please connect wallet');
            await switchToChainSelected();
            const allowance = await readContract(config.getClient(), {
                abi: erc20Abi,
                address: campaign.tokenFunding.address,
                functionName: 'allowance',
                args: [address, course.revenuePoolFactoryAddress],
            });
            if (BN(allowance).isLessThan(BN(amount).times(DEC(campaign.tokenFunding.decimals)))) {
                const tx = await writeContractAsync({
                    abi: erc20Abi,
                    address: campaign.tokenFunding.address,
                    functionName: 'approve',
                    args: [course.revenuePoolFactoryAddress, BigInt(Number(amount) * 10 ** campaign.tokenFunding.decimals)],
                });
                await waitForTransactionReceipt(config.getClient(), { hash: tx });
            }
            const tx2 = await writeContractAsync({
                abi: abiRevenuePoolFactory,
                address: course.revenuePoolFactoryAddress,
                functionName: 'createPool',
                args: [campaign.tokenFunding.address, BigInt(Number(amount) * 10 ** campaign.tokenFunding.decimals)],
            });
            await waitForTransactionReceipt(config.getClient(), { hash: tx2 });
            toast.success('Share revenue successfully');
        } catch (error) {
            toast.error(<ErrorExeTransaction error={{ error }} />);
        }
        setLoading(false);
    }
    return (
        <Box>
            <TextField
                label="Enter amount revenue share"
                fullWidth
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                InputProps={{ endAdornment: <Typography>{campaign.tokenFunding.symbol}</Typography> }}
            />

            <ButtonLoading muiProps={{ variant: 'contained', onClick: handleShareRevenue, sx: { mt: 3 }, fullWidth: true }} isLoading={loading}>
                Share Revenue
            </ButtonLoading>
        </Box>
    );
}
