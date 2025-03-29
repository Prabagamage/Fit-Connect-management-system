import React, { useState, useEffect } from 'react';
import AuthAxios from '../../utils/AuthAxios';
import { useNavigate, useParams } from 'react-router-dom';

const EditChallenge = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [step, setStep] = useState(1);
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
        participants: [], // Explicitly an empty array
        completedUsers: [],
        leaderboard: []
    });


    const [imagePreviews, setImagePreviews] = useState({
        challengeImagePreview: '',
        workoutStepsImagePreview: ''
    });

    // Fetch existing challenge data for editing
    useEffect(() => {
        if (id) {
            AuthAxios.get(`/api/challenges/${id}`)
                .then(response => {
                    setChallengeData(response.data);
                    // Set preview images if already uploaded
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setChallengeData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleWorkoutStepChange = (index, e) => {
        const { name, value } = e.target;
        const newWorkoutSteps = [...challengeData.workoutSteps];
        newWorkoutSteps[index][name] = value;
        setChallengeData(prevState => ({
            ...prevState,
            workoutSteps: newWorkoutSteps
        }));
    };

    const addWorkoutStep = () => {
        setChallengeData(prevState => ({
            ...prevState,
            workoutSteps: [
                ...prevState.workoutSteps,
                {
                    stepNo: prevState.workoutSteps.length + 1,
                    stepName: '',
                    stepCount: '',
                    time: '',
                    sets: ''
                }
            ]
        }));
    };

    const removeWorkoutStep = (indexToRemove) => {
        setChallengeData(prevState => ({
            ...prevState,
            workoutSteps: prevState.workoutSteps.filter((_, index) => index !== indexToRemove)
                .map((step, index) => ({ ...step, stepNo: index + 1 }))
        }));
    };

    const handleFileChange = (e, fileType) => {
        const file = e.target.files[0];
        setChallengeData(prevState => ({
            ...prevState,
            [fileType]: file
        }));

        // Preview the uploaded image
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreviews(prevState => ({
                ...prevState,
                [`${fileType}Preview`]: reader.result
            }));
        };
        reader.readAsDataURL(file);
    };

    const nextStep = () => {
        setStep(prevStep => prevStep + 1);
    };

    const prevStep = () => {
        setStep(prevStep => prevStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        try {
            // Explicitly handle each field
            const fieldsToAppend = [
                'gymName', 'challengeName', 'challengeCategory', 
                'challengeTimePeriod', 'focusBodyParts', 'fitnessBenefits', 
                'explanation', 'focus', 'type'
            ];

            fieldsToAppend.forEach(field => {
                if (challengeData[field]) {
                    formData.append(field, challengeData[field]);
                }
            });

            // Explicitly handle array fields
            const arrayFields = ['participants', 'completedUsers', 'leaderboard'];
            arrayFields.forEach(field => {
                // Only append if the array is not empty and contains valid entries
                if (challengeData[field] && challengeData[field].length > 0) {
                    formData.append(field, JSON.stringify(challengeData[field]));
                }
            });

            // Handle workout steps
            if (challengeData.workoutSteps && challengeData.workoutSteps.length > 0) {
                const filteredWorkoutSteps = challengeData.workoutSteps.filter(step => 
                    step.stepName || step.stepCount || step.time || step.sets
                );
                
                if (filteredWorkoutSteps.length > 0) {
                    formData.append('workoutSteps', JSON.stringify(filteredWorkoutSteps));
                }
            }

            // Handle image uploads
            if (challengeData.challengeImage) {
                formData.append('challengeImage', challengeData.challengeImage);
            }
            if (challengeData.workoutStepsImage) {
                formData.append('workoutStepsImage', challengeData.workoutStepsImage);
            }

            // Debug: Log all form data
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            // Submission logic
            let response;
            if (id) {
                response = await AuthAxios.put(`/api/challenges/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                response = await AuthAxios.post('/api/challenges', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            console.log('Challenge saved:', response.data);
            // alert('Challenge saved successfully!');
            navigate('/success');
        } catch (error) {
            console.error('Error creating/updating challenge:', error);
            alert(`Error saving challenge: ${error.response?.data?.message || error.message}`);
        }
    };


    const renderStep1 = () => (
        <div>
            <div className="flex flex-col gap-8 space-y-2 w-[1016px]">
                <input
                    type="text"
                    name="gymName"
                    value={challengeData.gymName}
                    onChange={handleInputChange}
                    placeholder="Gym Name"
                    className="w-full bg-gray-200 px-4 py-3 rounded-2xl mt-5"
                    required
                />
                <input
                    type="text"
                    name="challengeName"
                    value={challengeData.challengeName}
                    onChange={handleInputChange}
                    placeholder="Challenge Name"
                    className="w-full bg-gray-200 px-4 py-3 rounded-2xl mt-5"
                    required
                />
                <input
                    type="text"
                    name="challengeCategory"
                    value={challengeData.challengeCategory}
                    onChange={handleInputChange}
                    placeholder="Challenge Category (e.g., Cardio, Strength)"
                    className="w-full bg-gray-200 px-4 py-3 rounded-2xl mt-5"
                    required
                />
                <input
                    type="text"
                    name="challengeTimePeriod"
                    value={challengeData.challengeTimePeriod}
                    onChange={handleInputChange}
                    placeholder="Challenge Time Period"
                    className="w-full bg-gray-200 px-4 py-3 rounded-2xl mt-5"
                    required
                />
                <input
                    type="text"
                    name="focusBodyParts"
                    value={challengeData.focusBodyParts}
                    onChange={handleInputChange}
                    placeholder="Focus Body Parts"
                    className="w-full bg-gray-200 px-4 py-3 rounded-2xl mt-5"
                    required
                />
                <textarea
                    name="fitnessBenefits"
                    value={challengeData.fitnessBenefits}
                    onChange={handleInputChange}
                    placeholder="Fitness Benefits"
                    className="w-full bg-gray-200 px-4 py-3 rounded-2xl mt-5"
                    required
                />
                <textarea
                    name="explanation"
                    value={challengeData.explanation}
                    onChange={handleInputChange}
                    placeholder="Challenge Explanation"
                    className="w-full bg-gray-200 px-4 py-3 rounded-2xl mt-5"
                    required
                    rows={10}
                />
                <button
                    type="button"
                    onClick={nextStep}
                    className="bg-[#815B5B] text-white py-3 px-6 rounded-lg cursor-pointer mx-auto"
                >
                    Next
                </button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div>
            <div className="space-y-4 w-full">
                <div>
                    <label className="block mb-2">Challenge Image</label>
                    {imagePreviews.challengeImagePreview && (
                        <img
                            src={`http://localhost:5001${imagePreviews.challengeImagePreview}`}
                            alt="Challenge Preview"
                            className="w-32 h-32 object-cover mb-4"
                        />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'challengeImage')}
                        className="w-full bg-gray-200 px-4 py-3 rounded-2xl"
                    />
                </div>
                <div>
                    <label className="block mb-2 mt-5">Workout Steps Image</label>
                    {imagePreviews.workoutStepsImagePreview && (
                        <img
                            src={`http://localhost:5001${imagePreviews.workoutStepsImagePreview}`}
                            alt="Workout Steps Preview"
                            className="w-32 h-32 object-cover mb-4"
                        />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        placeholder="Upload Challenge image here"
                        onChange={(e) => handleFileChange(e, 'workoutStepsImage')}
                        className="w-full bg-gray-200 px-4 py-3 rounded-2xl"
                    />
                </div>

                <div>
                    <h3 className="text-sm font-semibold mb-4 mt-5">Workout Steps</h3>
                    {challengeData.workoutSteps.map((step, index) => (
                        <div key={index} className="w-full flex items-center space-x-3 mb-2">
                            <input
                                type="text"
                                name="stepName"
                                value={step.stepName}
                                onChange={(e) => handleWorkoutStepChange(index, e)}
                                placeholder="Step Name"
                                className="flex-1 bg-gray-200 py-3 px-6 rounded-2xl w-max"
                            />
                            <input
                                type="text"
                                name="stepCount"
                                value={step.stepCount}
                                onChange={(e) => handleWorkoutStepChange(index, e)}
                                placeholder="Step Count"
                                className="flex-1 bg-gray-200 py-3 px-6 rounded-2xl w-max"
                            />
                            <input
                                type="text"
                                name="time"
                                value={step.time}
                                onChange={(e) => handleWorkoutStepChange(index, e)}
                                placeholder="Time"
                                className="flex-1 bg-gray-200 py-3 px-6 rounded-2xl w-max"
                            />
                            <input
                                type="text"
                                name="sets"
                                value={step.sets}
                                onChange={(e) => handleWorkoutStepChange(index, e)}
                                placeholder="Sets"
                                className="flex-1 bg-gray-200 py-3 px-6 rounded-2xl w-max"
                            />
                            <button
                                type="button"
                                onClick={() => removeWorkoutStep(index)}
                                className="text-red-500"
                            >
                                Remove Step
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addWorkoutStep}
                        className="bg-[#815B5B] text-white py-3 px-6 rounded-lg cursor-pointer"
                    >
                        Add Workout Step
                    </button>
                </div>
                <button
                    type="button"
                    onClick={prevStep}
                    className="bg-[#815B5B] text-white py-3 px-6 rounded-lg cursor-pointer mx-auto"
                >
                    Previous
                </button>
            </div>
        </div>
    );

    return (
        <div div className='flex flex-col items-center gap-5 py-10'>
            <form onSubmit={handleSubmit} className="flex flex-col gap-8 items-center">
                <h1 className="text-2xl font-bold">Create or Edit Challenge</h1>
                {step === 1 ? renderStep1() : renderStep2()}
                <button
                    type="submit"
                    className="bg-green-500 text-white py-3 px-6 rounded-lg cursor-pointer mx-auto"
                >
                    Save Challenge
                </button>
            </form>

            <button
                onClick={() => navigate('/challenges')}
                className="bg-red-500 text-white py-3 px-6 rounded-lg cursor-pointer mx-auto"
            >
                Cancel
            </button>
        </div>
    );
};

export default EditChallenge;
