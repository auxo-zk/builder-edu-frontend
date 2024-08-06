import { CardCourse, Course, getCourses, NoData } from '@auxo-dev/frontend-common';
import { Box, Button, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { addressTest } from 'src/state/userProfile/state';
import { useAccount } from 'wagmi';

export default function ListCourse() {
    const { address } = useAccount();
    const [courses, setCourses] = useState<Course[]>([]);
    async function fetchCourses(addressUser: string) {
        try {
            const response = await getCourses(addressUser);
            setCourses(response);
        } catch (error) {
            console.error(error);
            setCourses([]);
        }
    }
    useEffect(() => {
        if (address) {
            // fetchCourses(address);
            fetchCourses(addressTest);
        }
    }, [address]);
    return (
        <Box>
            <Box textAlign={'center'}>{courses.length === 0 && <NoData />}</Box>
            <Box>
                <Grid container spacing={2}>
                    {courses.map((course, index) => {
                        return (
                            <Grid key={course.id + index} item xs={12} xsm={6} sm={4} lg={3}>
                                <CardCourse data={course}>
                                    <Button size="small" fullWidth sx={{ mt: 2 }} variant="outlined">
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
