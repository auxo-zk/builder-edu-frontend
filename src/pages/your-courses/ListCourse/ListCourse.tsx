import { CardCourse, Course, getCourses, NoData } from '@auxo-dev/frontend-common';
import { Box, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
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
            fetchCourses(address);
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
                                <CardCourse data={course} />
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
        </Box>
    );
}
