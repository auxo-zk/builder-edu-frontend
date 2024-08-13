import { DraftCourse, getDraftCourse, IconSpinLoading, NoData } from '@auxo-dev/frontend-common';
import { Container } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';
import EditDraftInfo from './EditDraftInfo/EditDraftInfo';

export default function EditDraftCourse() {
    const params = useParams();
    const [loading, setLoading] = React.useState(true);
    const [draftData, setDraftData] = React.useState<DraftCourse | null>(null);

    async function getDraftData(idDraft: string) {
        try {
            const response = await getDraftCourse(idDraft);
            setDraftData(response);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    React.useEffect(() => {
        if (params.idDraft) {
            getDraftData(params.idDraft);
        }
    }, [params.idDraft]);

    if (loading) {
        return (
            <Container sx={{ py: 5 }}>
                <IconSpinLoading sx={{ fontSize: '100px' }} />
            </Container>
        );
    }

    if (!draftData) {
        return (
            <Container sx={{ py: 5 }}>
                <NoData text="Not Found!" />
            </Container>
        );
    }

    return (
        <Container sx={{ pb: 5 }}>
            <EditDraftInfo draftInfo={draftData} />
        </Container>
    );
}
