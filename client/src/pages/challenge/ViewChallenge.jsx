import React, { useState, useEffect, useRef } from 'react';
import AuthAxios from '../../utils/AuthAxios';
import { useNavigate, useParams } from 'react-router-dom';

const ViewChallenge = () => {
    const { id } = useParams();
    const [step, setStep] = useState(1);
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef(null);
    const navigate = useNavigate();

    // State to track completed workout steps
    const [completedSteps, setCompletedSteps] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const [challengeData, setChallengeData] = useState({
        gymName: '',
        challengeName: '',
        challengeCategory: '',
        challengeTimePeriod: '',
        focusBodyParts: '',
        fitnessBenefits: '',
        explanation: '',
        challengeImage: null,
        workoutStepsImage: null,
        workoutSteps: [
            { stepNo: 1, stepName: '', stepCount: '', time: '', sets: '' }
        ],
        focus: '',
        type: '',
        participants: [],
        completedUsers: [],
        leaderboard: []
    });

    const [imagePreviews, setImagePreviews] = useState({
        challengeImagePreview: '',
        workoutStepsImagePreview: ''
    });

    // Timer functions remain the same
    const startTimer = () => {
        if (!isRunning) {
            setIsRunning(true);
            timerRef.current = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        }
    };

    const stopTimer = () => {
        clearInterval(timerRef.current);
        setIsRunning(false);
    };

    // Fetch challenge data
    useEffect(() => {
        if (id) {
            AuthAxios.get(`/api/challenges/${id}`)
                .then(response => {
                    setChallengeData(response.data);
                    // Initialize completed steps state
                    setCompletedSteps(new Array(response.data.workoutSteps.length).fill(false));
                    
                    if (response.data.challengeImage) {
                        setImagePreviews(prevState => ({
                            ...prevState,
                            challengeImagePreview: response.data.challengeImage
                        }));
                    }
                    if (response.data.workoutStepsImage) {
                        setImagePreviews(prevState => ({
                            ...prevState,
                            workoutStepsImagePreview: response.data.workoutStepsImage
                        }));
                    }
                })
                .catch(error => {
                    console.error('Error fetching challenge data:', error);
                    alert('Error fetching challenge data');
                });
        }
    }, [id]);

    // First two steps remain the same
    const renderStep1 = () => (
        <div>
            <div className="flex flex-col gap-8 space-y-2 w-[1016px]">
                {imagePreviews.challengeImagePreview && (
                    <img
                        src={`http://localhost:5001${imagePreviews.challengeImagePreview}`}
                        alt="Challenge Preview"
                        className="w-full h-[400px] object-cover mb-4"
                    />
                )}
                <p>{challengeData.explanation}</p>
                <button
                    onClick={() => setStep(2)}
                    className="bg-black text-white py-3 px-6 rounded-lg cursor-pointer mx-auto"
                >
                    accept challenge
                </button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div>
            <div className="flex flex-col gap-8 space-y-2 w-[1016px]">
                {imagePreviews.workoutStepsImagePreview && (
                    <img
                        src={'../images/group.png'}
                        alt="Challenge Preview"
                        className="h-screen w-auto mb-4"
                    />
                )}
                <button
                    onClick={() => setStep(3)}
                    className="bg-green-500 text-white py-3 px-6 rounded-lg cursor-pointer mx-auto"
                >
                    Next
                </button>
            </div>
        </div>
    );

    // Step 3 with disabled checkboxes and Next button
    const renderStep3 = () => {
        const allStepsCompleted = completedSteps.every(step => step);

        return (
            <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg w-full max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-6 text-green-400">
                    Workout Steps
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-700">
                        <thead className="bg-green-600">
                            <tr>
                                <th className="border border-gray-700 px-4 py-2">Complete</th>
                                <th className="border border-gray-700 px-4 py-2">Step No</th>
                                <th className="border border-gray-700 px-4 py-2">Step Name</th>
                                <th className="border border-gray-700 px-4 py-2">Step Count</th>
                                <th className="border border-gray-700 px-4 py-2">Time</th>
                                <th className="border border-gray-700 px-4 py-2">Sets</th>
                            </tr>
                        </thead>
                        <tbody>
                            {challengeData.workoutSteps.map((step, index) => (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                                        } text-center`}
                                >
                                    <td className="border border-gray-600 px-4 py-2">
                                        <input
                                            type="checkbox"
                                            checked={completedSteps[index]}
                                            disabled
                                            className="form-checkbox h-5 w-5 text-green-500"
                                        />
                                    </td>
                                    <td className="border border-gray-600 px-4 py-2">{step.stepNo}</td>
                                    <td className="border border-gray-600 px-4 py-2">{step.stepName || "N/A"}</td>
                                    <td className="border border-gray-600 px-4 py-2">{step.stepCount || "N/A"}</td>
                                    <td className="border border-gray-600 px-4 py-2">{step.time || "N/A"}</td>
                                    <td className="border border-gray-600 px-4 py-2">{step.sets || "N/A"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 text-center">
                    <button
                        onClick={() => setStep(4)}
                        className="bg-green-500 text-white py-3 px-6 rounded-lg cursor-pointer"
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    };

    // Step 4 with timer and Done button
    const renderStep4 = () => {
        const currentStep = challengeData.workoutSteps[currentStepIndex];

        return (
            <div className="flex flex-col items-center gap-8 space-y-2 w-[1016px]">
                <h2 className="text-2xl font-bold text-green-500">
                    Current Step: {currentStep.stepName}
                </h2>
                <h2 className="text-2xl text-black">
                    Current Step: {currentStep.time}
                </h2>
                <div className="text-4xl text-green-500 bg-black px-6 py-3 rounded-lg">
                    {new Date(time * 1000).toISOString().substr(11, 8)}
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={startTimer}
                        className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg"
                        disabled={isRunning}
                    >
                        Start
                    </button>
                    <button
                        onClick={stopTimer}
                        className="bg-red-500 text-white px-6 py-3 rounded-lg text-lg"
                    >
                        End
                    </button>
                </div>
                <button
                    className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg"
                    onClick={() => {
                        // Mark current step as completed
                        const newCompletedSteps = [...completedSteps];
                        newCompletedSteps[currentStepIndex] = true;
                        setCompletedSteps(newCompletedSteps);

                        // Reset timer
                        setTime(0);
                        stopTimer();

                        // Move to next step or back to step 3
                        if (currentStepIndex < challengeData.workoutSteps.length - 1) {
                            setCurrentStepIndex(currentStepIndex + 1);
                            setStep(3);
                        } else {
                            // All steps completed
                            setStep(5);
                        }
                    }}
                >
                    Done
                </button>
            </div>
        );
    };

    // Success step
    const renderStep5 = () => (
        <div>
            <div className="flex flex-col items-center gap-8 space-y-2 w-[1016px]">
                <p className=" text-black text-center text-4xl">
                    Congratulations! You've successfully completed the challenge!
                </p>
                <img src='https://png.pngtree.com/png-vector/20221215/ourmid/pngtree-green-check-mark-png-image_6525691.png' />
                <button
                onClick={()=>{navigate('/challenges')}} className='text-2xl font-bold text-white py-5 px-10 rounded-2xl bg-black'>Ok</button>
            </div>
        </div>
    );

    return (
        <div className='flex flex-col items-center gap-5 py-10'>
            <h1 className="text-2xl font-bold">{challengeData.challengeName}</h1>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && renderStep5()}
        </div>
    );
};

export default ViewChallenge;