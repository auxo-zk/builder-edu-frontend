import { CardCourse, Course, getCourses, IconSpinLoading, NoData } from '@auxo-dev/frontend-common';
import { Box, Button, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addressTest } from 'src/state/userProfile/state';
import { useAccount } from 'wagmi';

export default function ListCourse() {
    const { address } = useAccount();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function fetchCourses(addressUser: string) {
        setLoading(true);
        try {
            if (addressUser) {
                const response = await getCourses(addressUser);
                setCourses(response);
            }
        } catch (error) {
            console.error(error);
            setCourses([]);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchCourses(address || '');
    }, [address]);
    if (loading) {
        return (
            <Box mt={3}>
                <IconSpinLoading sx={{ fontSize: '100px' }} />
            </Box>
        );
    }
    return (
        <Box mt={3}>
            <Box textAlign={'center'}>{courses.length === 0 && <NoData />}</Box>
            <Box>
                <Grid container spacing={2}>
                    {courses.map((course, index) => {
                        return (
                            <Grid key={course.id + index} item xs={12} xsm={6} sm={4} lg={3}>
                                <CardCourse data={course}>
                                    <Button size="small" fullWidth sx={{ mt: 2 }} variant="outlined" onClick={() => navigate(`/your-courses/${course.id}/info-join-campaigns`)}>
                                        Join Campaign
                                    </Button>
                                </CardCourse>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
        </Box>
    );
}
