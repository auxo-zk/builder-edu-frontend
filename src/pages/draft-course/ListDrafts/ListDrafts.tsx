import { CardDraftCourse, deleteDraftCourse, DraftCourse, getDraftCourses, NoData } from '@auxo-dev/frontend-common';
import { Box, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';

export default function ListDrafts() {
    const { address } = useAccount();
    const [drafts, setDrafts] = useState<DraftCourse[]>([]);

    async function fetchDrafts() {
        try {
            const response = await getDraftCourses();
            setDrafts(response);
        } catch (error) {
            console.log(error);
            setDrafts([]);
        }
    }
    async function deleteCourse(draft: DraftCourse) {
        try {
            const confirm = window.confirm('Are you sure you want to delete this draft course?');
            if (!confirm) return;
            await deleteDraftCourse(draft.id);
            fetchDrafts();
            toast.success('Delete draft course success');
        } catch (error) {
            console.log(error);
            toast.error('Delete draft course failed');
        }
    }
    useEffect(() => {
        fetchDrafts();
    }, []);
    return (
        <Box>
            <Box textAlign={'center'}>{drafts.length === 0 && <NoData />}</Box>
            <Box>
                <Grid container spacing={2}>
                    {drafts.map((draft, index) => {
                        return (
                            <Grid key={draft.id + index} item xs={12} xsm={6} sm={4} lg={3}>
                                <CardDraftCourse item={draft} toLink={`/draft-courses/edit/${draft.id}`} onDeleteDraft={() => deleteCourse(draft)}></CardDraftCourse>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
        </Box>
    );
}
