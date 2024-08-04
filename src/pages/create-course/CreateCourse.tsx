import { MemberData } from '@auxo-dev/frontend-common';
import { Container } from '@mui/material';
import { useEffect, useState } from 'react';
import EditCourseData, { EditCourseDataProps } from 'src/components/EditCourseData/EditCourseData';
import { useUserProfile } from 'src/state/userProfile/state';

export type TDataEditCourse = Pick<
    EditCourseDataProps,
    'avatarImage' | 'bannerImage' | 'name' | 'publicKey' | 'problemStatement' | 'challengeAndRisk' | 'overViewDescription' | 'solution' | 'documents' | 'documentFiles' | 'members'
> & { avatarFile: File | null; bannerFile: File | null };
export default function CreateCourse() {
    const [value] = useUserProfile();
    const [dataPost, setDataPost] = useState<TDataEditCourse>({
        avatarImage: '',
        bannerImage: '',
        name: '',
        publicKey: '',
        overViewDescription: '',
        problemStatement: '',
        solution: '',
        challengeAndRisk: '',
        documents: [],
        documentFiles: [],
        members: [],
        avatarFile: null,
        bannerFile: null,
    });
    function changeDataPost(data: Partial<TDataEditCourse>) {
        setDataPost((prev) => ({ ...prev, ...data }));
    }
    function addDocumentFiles(files: TDataEditCourse['documentFiles']) {
        setDataPost((prev) => ({ ...prev, documentFiles: [...prev.documentFiles, ...files] }));
    }
    function deleteDocumentFiles(index: number) {
        setDataPost((prev) => {
            const newDocumentFiles = [...prev.documentFiles];
            newDocumentFiles.splice(index, 1);
            return { ...prev, documentFiles: newDocumentFiles };
        });
    }
    function deleteDocuments(index: number) {
        setDataPost((prev) => {
            const newDocuments = [...prev.documents];
            newDocuments.splice(index, 1);
            return { ...prev, documents: newDocuments };
        });
    }
    function addTeamMember() {
        setDataPost((prev) => ({ ...prev, members: [...prev.members, { name: '', role: '', publicKey: '', link: '' }] }));
    }
    function editTeamMember(index: number, data: Partial<MemberData>) {
        setDataPost((prev) => {
            const newMembers = [...prev.members];
            newMembers[index] = { ...newMembers[index], ...data };
            return { ...prev, members: newMembers };
        });
    }
    function removeTeamMember(index: number) {
        setDataPost((prev) => {
            const newMembers = [...prev.members];
            newMembers.splice(index, 1);
            return { ...prev, members: newMembers };
        });
    }
    useEffect(() => {
        if (value.state === 'hasData') {
            const { name, address, img, description, link, role } = value.data;
            setDataPost((prev) => ({ ...prev, members: [{ name: name, role: role, publicKey: address, link: link }, ...prev.members] }));
        }
    }, [value.state]);
    return (
        <Container sx={{ pb: 5 }}>
            <EditCourseData
                avatarImage={dataPost.avatarImage}
                bannerImage={dataPost.bannerImage}
                name={dataPost.name}
                publicKey={dataPost.publicKey}
                overViewDescription={dataPost.overViewDescription}
                problemStatement={dataPost.problemStatement}
                solution={dataPost.solution}
                documents={dataPost.documents}
                documentFiles={dataPost.documentFiles}
                members={dataPost.members}
                challengeAndRisk={dataPost.challengeAndRisk}
                addDocumentFiles={addDocumentFiles}
                deleteDocumentFiles={deleteDocumentFiles}
                deleteDocuments={deleteDocuments}
                addTeamMember={addTeamMember}
                editTeamMember={editTeamMember}
                removeTeamMember={removeTeamMember}
                onChangeName={(name) => changeDataPost({ name })}
                onChangeChallengeAndRisk={(challengeAndRisk) => changeDataPost({ challengeAndRisk })}
                onChangeSolution={(solution) => changeDataPost({ solution })}
                onChangeProblemStatement={(problemStatement) => changeDataPost({ problemStatement })}
                onChangeOverViewDescription={(overViewDescription) => changeDataPost({ overViewDescription })}
                onChangePublicKey={(publicKey) => changeDataPost({ publicKey })}
                onChangeAvatar={(file, url) => changeDataPost({ avatarFile: file, avatarImage: url })}
                onChangeBanner={(file, url) => changeDataPost({ bannerFile: file, bannerImage: url })}
            />
        </Container>
    );
}
