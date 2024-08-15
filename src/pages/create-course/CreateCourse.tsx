import {
    abiGovernorFactory,
    ButtonLoading,
    contractAddress,
    createDraftCourse,
    FileSaved,
    ipfsHashCreateCourse,
    MemberData,
    saveFile,
    TokenInfo,
    useSwitchToSelectedChain,
} from '@auxo-dev/frontend-common';
import { Box, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import EditCourseData, { EditCourseDataProps } from 'src/components/EditCourseData/EditCourseData';
import { useUserProfile } from 'src/state/userProfile/state';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from 'viem/actions';
import { config } from 'src/constants';

export type TDataEditCourse = Pick<
    EditCourseDataProps,
    'courseSymbol' | 'avatarImage' | 'bannerImage' | 'name' | 'publicKey' | 'problemStatement' | 'challengeAndRisk' | 'overViewDescription' | 'solution' | 'documents' | 'documentFiles' | 'members'
> & { avatarFile: File | null; bannerFile: File | null };
export default function CreateCourse() {
    const [userProfile] = useUserProfile();
    const navigate = useNavigate();
    const { switchToChainSelected, chainIdSelected } = useSwitchToSelectedChain();
    const { writeContractAsync } = useWriteContract();
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
        courseSymbol: '',
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
            let avatarUrl = '';
            let banner = '';
            let documents: FileSaved[] = [];
            if (dataPost.avatarFile) {
                avatarUrl = (await saveFile(dataPost.avatarFile)).URL;
            }
            if (dataPost.bannerFile) {
                banner = (await saveFile(dataPost.bannerFile)).URL;
            }
            if (dataPost.documentFiles.length > 0) {
                documents = await Promise.all(dataPost.documentFiles.map((i) => saveFile(i.file)));
            }
            const response = await createDraftCourse({
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

            let avatarUrl = '';
            let banner = '';
            let documents: FileSaved[] = [];
            if (dataPost.avatarFile) {
                avatarUrl = (await saveFile(dataPost.avatarFile)).URL;
            }
            if (!avatarUrl) throw Error('Avatar is required');

            if (dataPost.bannerFile) {
                banner = (await saveFile(dataPost.bannerFile)).URL;
            }
            if (!banner) throw Error('Banner is required');

            if (dataPost.documentFiles.length > 0) {
                documents = await Promise.all(dataPost.documentFiles.map((i) => saveFile(i.file)));
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
            toast.error('Error: ' + (error as Error).message);
        }
    }

    useEffect(() => {
        if (userProfile.state === 'hasData') {
            const { name, address, img, description, link, role } = userProfile.data;
            setDataPost((prev) => ({ ...prev, members: [{ name: name, role: role, publicKey: address, link: link }, ...prev.members] }));
        }
    }, [userProfile.state]);
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
