import {
    BoxAddDocument,
    BoxIntroducePage,
    ButtonLoading,
    Campaign,
    Course,
    CustomEditor,
    FileSaved,
    getCampaign,
    getCourse,
    IconChevonRight,
    IconSpinLoading,
    imagePath,
    ScopeOfWork,
} from '@auxo-dev/frontend-common';
import { ChevronLeftRounded, ChevronRight } from '@mui/icons-material';
import { Box, Breadcrumbs, Container, MenuItem, Select, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ScopeOfWorkComponent from './ScopeOfWork/ScopeOfWork';

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
    console.log(params);

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
                <ScopeOfWorkComponent scopeOfWorks={milestonData.scopeOfWorks} setMilestonData={setMilestonData} />
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
                <ButtonLoading isLoading={false} muiProps={{ variant: 'contained', onClick: () => {} }}>
                    Submit
                </ButtonLoading>
            </Box>
        </Container>
    );
}
