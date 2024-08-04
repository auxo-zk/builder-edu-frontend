import { Avatar, BoxAddDocument, BoxAddDocumentProps, BoxTeamMember, BoxTeamMemberProps, CustomEditor, InputBanner } from '@auxo-dev/frontend-common';
import { Box, TextField, Typography } from '@mui/material';
import React from 'react';
import { imagePath } from 'src/constants/imagePath';

export type EditCourseDataProps = {
    bannerImage: string;
    avatarImage: string;
    name: string;
    publicKey: string;
    overViewDescription: string;
    problemStatement: string;
    solution: string;
    challengeAndRisk: string;
    onChangeChallengeAndRisk: (challengeAndRisk: string) => void;
    onChangeSolution: (solution: string) => void;
    onChangeProblemStatement: (problemStatement: string) => void;
    onChangeOverViewDescription: (overViewDescription: string) => void;
    onChangePublicKey: (publicKey: string) => void;
    onChangeName: (name: string) => void;
    onChangeBanner: (file: File, imageUrl: string) => void;
    onChangeAvatar: (file: File, imageUrl: string) => void;
} & Omit<BoxTeamMemberProps, 'mt' | 'mb'> &
    Omit<BoxAddDocumentProps, 'mt' | 'mb'>;

export default function EditCourseData({
    bannerImage,
    avatarImage,
    name,
    publicKey,
    overViewDescription,
    problemStatement,
    solution,
    challengeAndRisk,
    members,
    documents,
    documentFiles,
    addDocumentFiles,
    addTeamMember,
    removeTeamMember,
    deleteDocumentFiles,
    deleteDocuments,
    editTeamMember,
    onChangeChallengeAndRisk,
    onChangeSolution,
    onChangeProblemStatement,
    onChangeOverViewDescription,
    onChangePublicKey,
    onChangeName,
    onChangeAvatar,
    onChangeBanner,
}: EditCourseDataProps) {
    return (
        <Box>
            <Box sx={{ position: 'relative', mb: 9 }}>
                <InputBanner
                    src={bannerImage || imagePath.DEFAULT_BANNER}
                    alt="banner project"
                    onChange={(files) => {
                        const file = files?.[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                                onChangeBanner(file, reader.result as string);
                            };
                            reader.readAsDataURL(file);
                        }
                    }}
                />
                <Box sx={{ position: 'absolute', left: '20px', bottom: '-50px', borderRadius: '50%', border: '4px solid #FFFFFF' }}>
                    <Avatar
                        src={avatarImage || imagePath.DEFAULT_AVATAR}
                        size={100}
                        onChange={(files) => {
                            const file = files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                    onChangeAvatar(file, reader.result as string);
                                };
                                reader.readAsDataURL(file);
                            }
                        }}
                    />
                </Box>
            </Box>

            <Typography variant="h2">{"Project's Information Editor"}</Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 3 }}>
                <TextField
                    fullWidth
                    label="Project's name"
                    type="text"
                    name="project_name"
                    sx={{ mr: 3 }}
                    value={name}
                    onChange={(e) => {
                        onChangeName(e.target.value);
                    }}
                />
                <TextField
                    fullWidth
                    label="Public key"
                    type="text"
                    name="project_name"
                    sx={{ ml: 3 }}
                    value={publicKey}
                    onChange={(e) => {
                        onChangePublicKey(e.target.value);
                    }}
                />
            </Box>
            <Typography variant="h6" mt={4} mb={1}>
                Overview description
            </Typography>
            <TextField
                fullWidth
                type="text"
                name="overview_desc"
                placeholder="Description of your project"
                value={overViewDescription}
                onChange={(e) => {
                    onChangeOverViewDescription(e.target.value);
                }}
            />

            <Typography variant="h6" mt={4} mb={1}>
                Problem Statement*
            </Typography>
            <CustomEditor
                value={problemStatement}
                onChange={(v: string) => {
                    onChangeProblemStatement(v);
                }}
            />

            <Typography variant="h6" mt={4} mb={1}>
                Solution*
            </Typography>
            <CustomEditor
                value={solution}
                onChange={(v: string) => {
                    onChangeSolution(v);
                }}
            />

            <Typography variant="h6" mt={4} mb={1}>
                Challenges & Risks*
            </Typography>
            <CustomEditor
                value={challengeAndRisk}
                onChange={(v: string) => {
                    onChangeChallengeAndRisk(v);
                }}
            />

            <BoxTeamMember mt={4} members={members} addTeamMember={addTeamMember} editTeamMember={editTeamMember} removeTeamMember={removeTeamMember} />
            <BoxAddDocument
                mt={4}
                documents={documents}
                documentFiles={documentFiles}
                addDocumentFiles={addDocumentFiles}
                deleteDocuments={deleteDocuments}
                deleteDocumentFiles={deleteDocumentFiles}
            />
        </Box>
    );
}
