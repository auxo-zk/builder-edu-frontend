import {
    abiGovernorFactory,
    ButtonLoading,
    contractAddress,
    DraftCourse,
    ErrorExeTransaction,
    FileSaved,
    ipfsHashCreateCourse,
    MemberData,
    saveFile,
    updateDraftCourse,
    useSwitchToSelectedChain,
} from '@auxo-dev/frontend-common';
import { Box, Container } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import EditCourseData from 'src/components/EditCourseData/EditCourseData';
import { config } from 'src/constants';
import { TDataEditCourse } from 'src/pages/create-course/CreateCourse';
import { waitForTransactionReceipt } from 'viem/actions';
import { useWriteContract } from 'wagmi';

export default function EditDraftInfo({ draftInfo }: { draftInfo: DraftCourse }) {
    const navigate = useNavigate();
    const { switchToChainSelected, chainIdSelected } = useSwitchToSelectedChain();
    const { writeContractAsync } = useWriteContract();
    const [dataPost, setDataPost] = useState<TDataEditCourse>({
        avatarImage: draftInfo.avatar,
        bannerImage: draftInfo.banner,
        name: draftInfo.name,
        publicKey: draftInfo.publicKey,
        overViewDescription: draftInfo.description,
        problemStatement: draftInfo.problemStatement,
        solution: draftInfo.solution,
        challengeAndRisk: draftInfo.challengeAndRisk,
        documents: draftInfo.documents,
        documentFiles: [],
        members: draftInfo.member,
        avatarFile: null,
        bannerFile: null,
        courseSymbol: draftInfo.courseSymbol,
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

    async function saveDraft() {
        try {
            let avatarUrl = draftInfo.avatar;
            let banner = draftInfo.banner;
            let documents: FileSaved[] = dataPost.documents;
            if (dataPost.avatarFile) {
                avatarUrl = (await saveFile(dataPost.avatarFile)).URL;
            }
            if (dataPost.bannerFile) {
                banner = (await saveFile(dataPost.bannerFile)).URL;
            }
            if (dataPost.documentFiles.length > 0) {
                const documentAdded = await Promise.all(dataPost.documentFiles.map((i) => saveFile(i.file)));
                documents.push(...documentAdded);
            }
            const response = await updateDraftCourse(draftInfo.id, {
                avatarImage: avatarUrl,
                coverImage: banner,
                description: dataPost.overViewDescription,
                members: dataPost.members,
                name: dataPost.name,
                publicKey: dataPost.publicKey,
                solution: dataPost.solution,
                problemStatement: dataPost.problemStatement,
                challengeAndRisk: dataPost.challengeAndRisk,
                documents: documents,
                courseSymbol: dataPost.courseSymbol,
            });
            console.log(response);
            toast.success('Save draft success!');
            navigate('/draft-courses');
        } catch (error) {
            console.error(error);
            toast.error('Error: ' + (error as Error).message);
        }
    }

    async function createCourse() {
        try {
            if (!dataPost.name) throw Error('Name course is required');
            if (!dataPost.publicKey) throw Error('Public key is required');
            if (!dataPost.overViewDescription) throw Error('Overview description is required');
            if (!dataPost.problemStatement) throw Error('Problem statement is required');
            if (!dataPost.solution) throw Error('Solution is required');
            if (!dataPost.challengeAndRisk) throw Error('Challenge and risk is required');
            if (!dataPost.courseSymbol) throw Error('Course symbol is required');

            let avatarUrl = draftInfo.avatar;
            let banner = draftInfo.banner;
            let documents: FileSaved[] = draftInfo.documents;
            if (dataPost.avatarFile) {
                avatarUrl = (await saveFile(dataPost.avatarFile)).URL;
            }
            if (!avatarUrl) throw Error('Avatar is required');

            if (dataPost.bannerFile) {
                banner = (await saveFile(dataPost.bannerFile)).URL;
            }
            if (!banner) throw Error('Banner is required');

            if (dataPost.documentFiles.length > 0) {
                const documentsAdded = await Promise.all(dataPost.documentFiles.map((i) => saveFile(i.file)));
                documents.push(...documentsAdded);
            }

            const response = await ipfsHashCreateCourse({
                avatarImage: avatarUrl,
                coverImage: banner,
                description: dataPost.overViewDescription,
                members: dataPost.members,
                name: dataPost.name,
                publicKey: dataPost.publicKey,
                solution: dataPost.solution,
                problemStatement: dataPost.problemStatement,
                challengeAndRisk: dataPost.challengeAndRisk,
                documents: documents,
                courseSymbol: dataPost.courseSymbol,
            });
            console.log(response);

            await switchToChainSelected();
            const exeAction = await writeContractAsync({
                abi: abiGovernorFactory,
                functionName: 'createGovernor',
                args: [dataPost.name, dataPost.name, dataPost.courseSymbol, response.HashHex],
                address: contractAddress[chainIdSelected].GovernorFactory,
            });
            console.log({ exeAction });

            const waitTx = await waitForTransactionReceipt(config.getClient(), { hash: exeAction });
            console.log({ waitTx });

            toast.success('Create course success!');
        } catch (error) {
            console.error(error);
            toast.error(<ErrorExeTransaction error={error} />);
        }
    }

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
                courseSymbol={dataPost.courseSymbol}
                onChangeCouseSymbol={(courseSymbol) => changeDataPost({ courseSymbol })}
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

            <Box sx={{ mt: 3 }} textAlign={'right'}>
                <ButtonSaveDraft onClick={saveDraft} />
                <ButtonCreateCourse onClick={createCourse} />
            </Box>
        </Container>
    );
}

function ButtonSaveDraft({ onClick }: { onClick: () => Promise<void> }) {
    const [loading, setLoading] = useState(false);

    async function handleSaveDraft() {
        setLoading(true);
        await onClick();
        setLoading(false);
    }
    return (
        <ButtonLoading muiProps={{ variant: 'contained', color: 'secondary', sx: { mr: 1 }, onClick: handleSaveDraft }} isLoading={loading}>
            Save Draft
        </ButtonLoading>
    );
}
function ButtonCreateCourse({ onClick }: { onClick: () => Promise<void> }) {
    const [loading, setLoading] = useState(false);

    async function handleClick() {
        setLoading(true);
        await onClick();
        setLoading(false);
    }
    return (
        <ButtonLoading muiProps={{ variant: 'contained', onClick: handleClick }} isLoading={loading}>
            Create Course
        </ButtonLoading>
    );
}
