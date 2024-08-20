import {
    abiCampaign,
    BoxAddDocument,
    BoxIntroducePage,
    ButtonLoading,
    Campaign,
    contractAddress,
    Course,
    CustomEditor,
    ErrorExeTransaction,
    FileSaved,
    getCampaign,
    getCourse,
    IconChevonRight,
    IconSpinLoading,
    imagePath,
    ipfsHashJoinCampaign,
    saveFile,
    ScopeOfWork,
    useSwitchToSelectedChain,
} from '@auxo-dev/frontend-common';
import { ChevronLeftRounded, ChevronRight } from '@mui/icons-material';
import { Box, Breadcrumbs, Container, MenuItem, Select, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ScopeOfWorkComponent from './ScopeOfWork/ScopeOfWork';
import { toast } from 'react-toastify';
import { useAccount, useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from 'viem/actions';
import { config } from 'src/constants';

export type EditMilestoneData = {
    answerQuestionCampaign: string[];
    documentFiles: { name: string; file: File }[];
    scopeOfWorks: (ScopeOfWork & { id: string })[];
};

export default function JoinCampaign() {
    const params = useParams();
    const [campaign, setCampaign] = React.useState<Campaign | null>(null);
    const [course, setCourse] = React.useState<Course | null>(null);
    const [loading, setLoading] = React.useState(true);
    const { address } = useAccount();
    const { writeContractAsync } = useWriteContract();
    const { chainId, chainIdSelected, switchToChainSelected } = useSwitchToSelectedChain();
    const [milestonData, setMilestonData] = React.useState<EditMilestoneData>({
        answerQuestionCampaign: [],
        documentFiles: [],
        scopeOfWorks: [
            {
                id: Date.now().toString(),
                information: '',
                milestone: '',
                raisingAmount: '0',
                deadline: Date.now().toLocaleString(),
            },
        ],
    });

    function changeAnserQuestionCampaign(index: number, value: string) {
        setMilestonData((prev) => ({ ...prev, answerQuestionCampaign: prev.answerQuestionCampaign.map((v, i) => (i === index ? value : v)) }));
    }

    async function fetchCampaign(idCampaign: string) {
        try {
            const response = await getCampaign(idCampaign);
            setMilestonData((prev) => ({ ...prev, answerQuestionCampaign: response.questions.map(() => '') }));
            return response;
        } catch (error) {
            console.error(error);
        }
        return null;
    }
    async function fetchCourse(idCourse: string) {
        try {
            const response = await getCourse(idCourse);
            console.log(response);
            return response;
        } catch (error) {
            console.error(error);
        }
        return null;
    }

    async function submit() {
        const idtoast = toast.loading('Creating transaction...', { position: 'top-center', type: 'info' });
        try {
            if (!address) {
                throw Error('Connect wallet required!');
            }
            if (!course || !campaign) {
                throw Error('Course or campaign not found!');
            }
            if (course.founder != address) {
                throw Error('You are not the founder of this course! Address founder: ' + course.founder);
            }

            let documents: FileSaved[] = [];
            if (milestonData.documentFiles.length > 0) {
                documents = await Promise.all(milestonData.documentFiles.map((i) => saveFile(i.file)));
            }

            const ipfs = await ipfsHashJoinCampaign({
                answers: milestonData.answerQuestionCampaign,
                scopeOfWorks: milestonData.scopeOfWorks,
                documents: documents,
            });
            console.log(ipfs);
            await switchToChainSelected();
            const exeAction = await writeContractAsync({
                abi: abiCampaign,
                address: contractAddress[chainIdSelected].Campaign,
                functionName: 'joinCampaign',
                args: [BigInt(campaign.campaignId), course.address, ipfs.HashHex],
            });

            console.log({ exeAction });

            const waitTx = await waitForTransactionReceipt(config.getClient(), { hash: exeAction });
            console.log({ waitTx });

            toast.update(idtoast, { render: 'Transaction successfull!', isLoading: false, type: 'success', autoClose: 3000, hideProgressBar: false });
        } catch (error) {
            console.error(error);
            if (idtoast) {
                toast.update(idtoast, { render: <ErrorExeTransaction error={error} />, type: 'error', position: 'top-center', isLoading: false, autoClose: 4000, hideProgressBar: false });
            }
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await Promise.allSettled([fetchCampaign(params.campaignId || ''), fetchCourse(params.courseId || '')]);

                if (response[0].status === 'fulfilled') {
                    setCampaign(response[0].value);
                }
                if (response[1].status === 'fulfilled') {
                    setCourse(response[1].value);
                }
            } catch (e) {
                console.log(e);
            }
            setLoading(false);
        })();
    }, []);
    if (loading) {
        return (
            <Container sx={{ py: 5 }}>
                <IconSpinLoading sx={{ fontSize: '100px' }} />
            </Container>
        );
    }

    if (!campaign) {
        return (
            <Container sx={{ py: 5 }}>
                <BoxIntroducePage title="Campaign not found!" thumnail={imagePath.LOGO_AUXO_2D}></BoxIntroducePage>
            </Container>
        );
    }

    if (!course) {
        return (
            <Container sx={{ py: 5 }}>
                <BoxIntroducePage title="Course not found!" thumnail={imagePath.LOGO_AUXO_2D}></BoxIntroducePage>
            </Container>
        );
    }
    return (
        <Container sx={{ py: 5 }}>
            <Box sx={{ display: 'flex', mt: 2, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Breadcrumbs>
                        <Link color="inherit" to={`/your-courses/${course.id}/info-join-campaigns`} style={{ textDecoration: 'none', color: 'unset' }}>
                            <Box sx={{ display: 'flex', placeItems: 'center' }}>
                                <ChevronLeftRounded color="primary" sx={{ fontSize: '24px' }} />
                                <Typography color={'primary.main'}>Join Campaign</Typography>
                            </Box>
                        </Link>
                        <Typography color={'primary.main'} fontWeight={600}>
                            Milestone editor
                        </Typography>
                    </Breadcrumbs>
                    <Typography variant="h1">Milestones Editor</Typography>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        placeItems: 'center',
                        gap: 2,
                        ml: 'auto',
                        '& > .imgAvatar': { width: { xs: '60px', sm: '97px' }, height: { xs: '60px', sm: '97px' } },
                        '& > .imgBanner': { height: { xs: '60px', sm: '97px' } },
                    }}
                >
                    <img className="imgAvatar" src={course.avatar} alt="course avatar" style={{ borderRadius: '50%' }} />
                    <IconChevonRight sx={{ fontSize: '45px', color: 'secondary.main' }} />
                    <img className="imgBanner" src={campaign.banner} alt="campaign banner" style={{ aspectRatio: '272/97', borderRadius: '12px' }} />
                </Box>
            </Box>

            {campaign.questions.map((question, index) => {
                return (
                    <Box key={question.question + index}>
                        <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                            <Box dangerouslySetInnerHTML={{ __html: question.question }} />
                            {question.isRequired && (
                                <Typography color={'secondary'} ml={1}>
                                    *
                                </Typography>
                            )}
                        </Box>
                        {question.hint ? <Typography color={'text.secondary'}>Hint: {question.hint}</Typography> : <></>}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                            <Select
                                size="small"
                                defaultValue={'customAnswer'}
                                onChange={(e) => {
                                    const selectVal = String(e.target.value || '') as 'problemStatement' | 'solution' | 'challengeAndRisk' | 'customAnswer';
                                    changeAnserQuestionCampaign(index, selectVal == 'customAnswer' ? '' : course[selectVal]);
                                }}
                                sx={{ minWidth: '210px' }}
                            >
                                <MenuItem value={'problemStatement'}>Problem statement</MenuItem>
                                <MenuItem value={'solution'}>Solution</MenuItem>
                                <MenuItem value={'challengeAndRisk'}>Challenges & Risks</MenuItem>
                                <MenuItem value={'customAnswer'}>Custom Answer</MenuItem>
                            </Select>
                        </Box>
                        <CustomEditor
                            value={milestonData.answerQuestionCampaign[index] || ''}
                            onChange={(v: string) => {
                                changeAnserQuestionCampaign(index, String(v || ''));
                            }}
                        />
                    </Box>
                );
            })}

            <Box sx={{ mt: 5 }}>
                <ScopeOfWorkComponent token={campaign.tokenFunding} scopeOfWorks={milestonData.scopeOfWorks} setMilestonData={setMilestonData} />
            </Box>
            <Box sx={{ mt: 8 }}>
                <BoxAddDocument
                    documents={[]}
                    documentFiles={milestonData.documentFiles}
                    addDocumentFiles={(files) => {
                        setMilestonData((prev) => ({ ...prev, documentFiles: [...prev.documentFiles, ...files] }));
                    }}
                    deleteDocumentFiles={(index) => {
                        setMilestonData((prev) => ({ ...prev, documentFiles: prev.documentFiles.filter((_, i) => i !== index) }));
                    }}
                    deleteDocuments={() => {}}
                />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 3 }}>
                <ButtonSubmit onClick={submit} />
            </Box>
        </Container>
    );
}

function ButtonSubmit({ onClick }: { onClick: () => Promise<void> }) {
    const [loading, setLoading] = React.useState(false);
    const handerClick = async () => {
        setLoading(true);
        await onClick();
        setLoading(false);
    };
    return (
        <ButtonLoading isLoading={loading} muiProps={{ variant: 'contained', onClick: handerClick }}>
            Submit
        </ButtonLoading>
    );
}
