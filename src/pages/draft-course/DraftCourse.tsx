import { BoxIntroducePage } from '@auxo-dev/frontend-common';
import { Container } from '@mui/material';
import ListDrafts from './ListDrafts/ListDrafts';

export default function DraftCourse() {
    return (
        <Container sx={{ py: 5 }}>
            <BoxIntroducePage thumnail="/images/auxo-thumbnail3.png" title="Draft Courses"></BoxIntroducePage>

            <ListDrafts />
        </Container>
    );
}
