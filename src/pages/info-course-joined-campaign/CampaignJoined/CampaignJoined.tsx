import {
    ButtonLoading,
    Campaign,
    CampaignFundraising,
    CampaignState,
    CardCampaign,
    Course,
    getCampaigns,
    getFundraisingInfoByProjectId,
    IconSpinLoading,
    StateCampaign,
    TableCell,
    TableHeader,
    TableRow,
    TableWrapper,
} from '@auxo-dev/frontend-common';
import { Box, Button, Grid, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonShareRevenue from './ButtonShareRevenue/ButtonShareRevenue';
import ButtonVesting from './ButtonVesting/ButtonVesting';

const tableCellRatio = [0.5, 2.5, 2, 2, 2, 3];

export default function CampaignJoined({ course }: { course: Course }) {
    const [loading, setLoading] = React.useState(true);
    const [joiningCampaign, setJoiningCampaign] = React.useState<CampaignFundraising[]>([]);
    const [campaignNotJoined, setCampaignNotJoined] = React.useState<Campaign[]>([]);
    const navigate = useNavigate();

    async function fetchData() {
        try {
            const [joiningCampaign, allCampaign] = await Promise.all([getFundraisingInfoByProjectId(course.address), getCampaigns()]);
            setJoiningCampaign(joiningCampaign);
            setCampaignNotJoined(allCampaign.filter((campaign) => !joiningCampaign.find((c) => c.campaignId === campaign.campaignId && campaign.state == CampaignState.APPLICATION)));
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, [course.id]);

    if (loading) {
        return (
            <Box sx={{ py: 5 }}>
                <IconSpinLoading sx={{ fontSize: '100px' }} />
            </Box>
        );
    }
    return (
        <Box>
            <Typography variant="h6" mb={2}>
                Joined Campaign
            </Typography>

            <TableWrapper sx={{ overflow: 'auto' }}>
                <TableHeader sx={{ minWidth: '900px' }}>
                    <TableCell xs={tableCellRatio[0]}>
                        <Typography variant="body2" color={'text.secondary'}>
                            ID
                        </Typography>
                    </TableCell>
                    <TableCell xs={tableCellRatio[1]}>
                        <Typography variant="body2" color={'text.secondary'}>
                            Campaign Name
                        </Typography>
                    </TableCell>
                    <TableCell xs={tableCellRatio[2]}>
                        <Typography variant="body2" color={'text.secondary'}>
                            Status
                        </Typography>
                    </TableCell>
                    <TableCell xs={tableCellRatio[3]}>
                        <Typography variant="body2" color={'text.secondary'}>
                            Target Amount
                        </Typography>
                    </TableCell>
                    <TableCell xs={tableCellRatio[4]}>
                        <Typography variant="body2" color={'text.secondary'}>
                            Funded Amount
                        </Typography>
                    </TableCell>
                    <TableCell xs={tableCellRatio[5]}>
                        <Typography variant="body2" color={'text.secondary'}>
                            Action
                        </Typography>
                    </TableCell>
                </TableHeader>

                {joiningCampaign.map((campaign, index) => (
                    <TableRow sx={{ minWidth: '900px' }} key={campaign.campaignId + 'joined' + index}>
                        <TableCell xs={tableCellRatio[0]}>
                            <Typography>{campaign.campaignId}</Typography>
                        </TableCell>
                        <TableCell xs={tableCellRatio[1]}>
                            <Typography>{campaign.campaignName}</Typography>
                        </TableCell>
                        <TableCell xs={tableCellRatio[2]}>
                            <Typography>
                                <StateCampaign state={campaign.campaignState} />
                            </Typography>
                        </TableCell>
                        <TableCell xs={tableCellRatio[3]}>
                            <Typography>
                                {campaign.targetAmount} {campaign.tokenFunding.symbol}
                            </Typography>
                        </TableCell>
                        <TableCell xs={tableCellRatio[4]}>
                            <Typography>
                                {campaign.fundedAmount} {campaign.tokenFunding.symbol}
                            </Typography>
                        </TableCell>
                        <TableCell xs={tableCellRatio[5]}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <ButtonShareRevenue course={course} campaign={campaign} />
                                <ButtonVesting course={course} campaign={campaign} />
                            </Box>
                        </TableCell>
                    </TableRow>
                ))}
            </TableWrapper>

            <Typography variant="h6" mt={5} mb={2}>
                Join with other campain
            </Typography>
            <Grid container spacing={2}>
                {campaignNotJoined.map((campaign, index) => (
                    <Grid key={campaign.campaignId + 'notjoined' + index} item xs={12} xsm={6}>
                        <CardCampaign data={campaign}>
                            <Box textAlign={'right'}>
                                <Button variant="outlined" size="small" color="secondary" onClick={() => navigate(`/your-courses/${course.id}/join-campaign/${campaign.campaignId}`)}>
                                    Join
                                </Button>
                            </Box>
                        </CardCampaign>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
