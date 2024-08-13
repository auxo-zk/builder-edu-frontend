import { BoxIntroducePage, Course, getCourse, IconSpinLoading, imagePath } from '@auxo-dev/frontend-common';
import { Box, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CampaignJoined from './CampaignJoined/CampaignJoined';

export default function InfoCourseJoinedCampaign() {
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState<Course | null>(null);

    async function fetchCourse(idCourse: string) {
        try {
            const response = await getCourse(idCourse);
            console.log(response);
            setCourse(response);
        } catch (error) {
            console.error(error);
            setCourse(null);
        }
        setLoading(false);
    }

    useEffect(() => {
        if (params.courseId) {
            fetchCourse(params.courseId);
        }
    }, [params.courseId]);

    if (loading) {
        return (
            <Container sx={{ py: 5 }}>
                <IconSpinLoading sx={{ fontSize: '100px' }} />
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
            <BoxIntroducePage title="Joined Campaign" thumnail="/images/auxo-thumbnail3.png"></BoxIntroducePage>
            <CampaignJoined courseId={course.id} />
        </Container>
    );
}
