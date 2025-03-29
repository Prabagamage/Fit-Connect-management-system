import React, { useState } from 'react';
import AuthAxios from '../../utils/AuthAxios';
import { useNavigate } from 'react-router-dom';

const CreateChallenge = () => {
    const navigate = useNavigate();
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
        type: ''
    });
    
    // Add validation state
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setChallengeData(prevState => ({
            ...prevState,
            [name]: value
        }));
        
        // Clear error for this field when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const handleWorkoutStepChange = (index, e) => {
        const { name, value } = e.target;
        const newWorkoutSteps = [...challengeData.workoutSteps];
        newWorkoutSteps[index][name] = value;
        setChallengeData(prevState => ({
            ...prevState,
            workoutSteps: newWorkoutSteps
        }));
        
        // Clear error for workout steps when user types
        if (errors.workoutSteps) {
            setErrors({
                ...errors,
                workoutSteps: ''
            });
        }
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
        
        // Clear error for this file field when user uploads
        if (errors[fileType]) {
            setErrors({
                ...errors,
                [fileType]: ''
            });
        }
    };

    const validateStep1 = () => {
        const newErrors = {};
        const requiredFields = ['gymName', 'challengeName', 'challengeCategory', 'challengeTimePeriod', 'focusBodyParts', 'fitnessBenefits', 'explanation'];
        
        requiredFields.forEach(field => {
            if (!challengeData[field]) {
                newErrors[field] = 'This field is required';
            }
        });
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const validateStep2 = () => {
        const newErrors = {};
        
        // Validate file uploads
        if (!challengeData.challengeImage) {
            newErrors.challengeImage = 'Challenge image is required';
        }
        
        if (!challengeData.workoutStepsImage) {
            newErrors.workoutStepsImage = 'Workout steps image is required';
        }
        
        // Validate workout steps - at least one step must be complete
        const hasValidWorkoutStep = challengeData.workoutSteps.some(step => 
            step.stepName && step.stepCount && step.time && step.sets
        );
        
        if (!hasValidWorkoutStep) {
            newErrors.workoutSteps = 'At least one complete workout step is required';
        }
        
        // Validate other fields
        if (!challengeData.focus) {
            newErrors.focus = 'Focus is required';
        }
        
        if (!challengeData.type) {
            newErrors.type = 'Challenge type is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep1()) {
            setStep(prevStep => prevStep + 1);
        }
    };

    const prevStep = () => {
        setStep(prevStep => prevStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateStep2()) {
            return;
        }

        const formData = new FormData();

        console.log('Full Challenge Data:', challengeData);

        try {
            Object.keys(challengeData).forEach(key => {
                if (key === 'workoutSteps') {
                    formData.append(key, JSON.stringify(
                        challengeData[key].filter(step =>
                            step.stepName.trim() !== '' ||
                            step.stepCount.trim() !== '' ||
                            step.time.trim() !== '' ||
                            step.sets.trim() !== ''
                        )
                    ));
                } else if (key !== 'challengeImage' && key !== 'workoutStepsImage') {
                    formData.append(key, challengeData[key]);
                }
            });

            if (challengeData.challengeImage) {
                formData.append('challengeImage', challengeData.challengeImage);
            }
            if (challengeData.workoutStepsImage) {
                formData.append('workoutStepsImage', challengeData.workoutStepsImage);
            }

            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            const response = await AuthAxios.post('/api/challenges', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Challenge created:', response.data);
            alert('Challenge created successfully!');
            navigate('/success');
            setChallengeData(
                {
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
                    type: ''
                }
            )
            setStep(1);

        } catch (error) {
            console.error('Full Error Object:', error);
            console.error('Error Response:', error.response?.data);
            console.error('Error Status:', error.response?.status);
            console.error('Error Headers:', error.response?.headers);

            alert(`Error creating challenge: ${error.response?.data?.message || error.message}`);
        }
    };

    const renderStep1 = () => (
        <div>
            <div className="flex flex-col gap-8 space-y-2 w-[1016px]">
                <div>
                    <input
                        type="text"
                        name="gymName"
                        value={challengeData.gymName}
                        onChange={handleInputChange}
                        placeholder="Gym Name *"
                        className={`w-full bg-gray-200 px-4 py-3 rounded-2xl mt-5 ${errors.gymName ? 'border-2 border-red-500' : ''}`}
                        required
                    />
                    {errors.gymName && <p className="text-red-500 text-sm mt-1">{errors.gymName}</p>}
                </div>
                
                <div>
                    <input
                        type="text"
                        name="challengeName"
                        value={challengeData.challengeName}
                        onChange={handleInputChange}
                        placeholder="Challenge Name *"
                        className={`w-full bg-gray-200 px-4 py-3 rounded-2xl mt-5 ${errors.challengeName ? 'border-2 border-red-500' : ''}`}
                        required
                    />
                    {errors.challengeName && <p className="text-red-500 text-sm mt-1">{errors.challengeName}</p>}
                </div>
                
                <div>
                    <input
                        type="text"
                        name="challengeCategory"
                        value={challengeData.challengeCategory}
                        onChange={handleInputChange}
                        placeholder="Challenge Category (e.g., Cardio, Strength) *"
                        className={`w-full bg-gray-200 px-4 py-3 rounded-2xl mt-5 ${errors.challengeCategory ? 'border-2 border-red-500' : ''}`}
                        required
                    />
                    {errors.challengeCategory && <p className="text-red-500 text-sm mt-1">{errors.challengeCategory}</p>}
                </div>
                
                <div>
                    <input
                        type="text"
                        name="challengeTimePeriod"
                        value={challengeData.challengeTimePeriod}
                        onChange={handleInputChange}
                        placeholder="Challenge Time Period *"
                        className={`w-full bg-gray-200 px-4 py-3 rounded-2xl mt-5 ${errors.challengeTimePeriod ? 'border-2 border-red-500' : ''}`}
                        required
                    />
                    {errors.challengeTimePeriod && <p className="text-red-500 text-sm mt-1">{errors.challengeTimePeriod}</p>}
                </div>
                
                <div>
                    <input
                        type="text"
                        name="focusBodyParts"
                        value={challengeData.focusBodyParts}
                        onChange={handleInputChange}
                        placeholder="Focus Body Parts *"
                        className={`w-full bg-gray-200 px-4 py-3 rounded-2xl mt-5 ${errors.focusBodyParts ? 'border-2 border-red-500' : ''}`}
                        required
                    />
                    {errors.focusBodyParts && <p className="text-red-500 text-sm mt-1">{errors.focusBodyParts}</p>}
                </div>
                
                <div>
                    <textarea
                        name="fitnessBenefits"
                        value={challengeData.fitnessBenefits}
                        onChange={handleInputChange}
                        placeholder="Fitness Benefits *"
                        className={`w-full bg-gray-200 px-4 py-3 rounded-2xl mt-5 ${errors.fitnessBenefits ? 'border-2 border-red-500' : ''}`}
                        required
                    />
                    {errors.fitnessBenefits && <p className="text-red-500 text-sm mt-1">{errors.fitnessBenefits}</p>}
                </div>
                
                <div>
                    <textarea
                        name="explanation"
                        value={challengeData.explanation}
                        onChange={handleInputChange}
                        placeholder="Challenge Explanation *"
                        className={`w-full bg-gray-200 px-4 py-3 rounded-2xl mt-5 ${errors.explanation ? 'border-2 border-red-500' : ''}`}
                        required
                        rows={10}
                    />
                    {errors.explanation && <p className="text-red-500 text-sm mt-1">{errors.explanation}</p>}
                </div>
                
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
                    <label className="block mb-2">Challenge Image *</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'challengeImage')}
                        className={`w-full bg-gray-200 px-4 py-3 rounded-2xl ${errors.challengeImage ? 'border-2 border-red-500' : ''}`}
                        required
                    />
                    {errors.challengeImage && <p className="text-red-500 text-sm mt-1">{errors.challengeImage}</p>}
                </div>
                
                <div>
                    <label className="block mb-2 mt-5">Workout Steps Image *</label>
                    <input
                        type="file"
                        accept="image/*"
                        placeholder='Upload Challenge image here'
                        onChange={(e) => handleFileChange(e, 'workoutStepsImage')}
                        className={`w-full bg-gray-200 px-4 py-3 rounded-2xl ${errors.workoutStepsImage ? 'border-2 border-red-500' : ''}`}
                        required
                    />
                    {errors.workoutStepsImage && <p className="text-red-500 text-sm mt-1">{errors.workoutStepsImage}</p>}
                </div>

                <div>
                    <h3 className="text-sm font-semibold mb-4 mt-5">Step Up workout steps and task for workout chart *</h3>
                    {errors.workoutSteps && <p className="text-red-500 text-sm mb-2">{errors.workoutSteps}</p>}
                    
                    {challengeData.workoutSteps.map((step, index) => (
                        <div key={index} className="w-full flex items-center space-x-3 mb-2">
                            <input
                                type="text"
                                name="stepName"
                                value={step.stepName}
                                onChange={(e) => handleWorkoutStepChange(index, e)}
                                placeholder="Step Name *"
                                className="flex-1 bg-gray-200 py-3 px-6 rounded-2xl w-max"
                                required
                            />
                            <input
                                type="text"
                                name="stepCount"
                                value={step.stepCount}
                                onChange={(e) => handleWorkoutStepChange(index, e)}
                                placeholder="Step Count *"
                                className="flex-1 bg-gray-200 py-3 px-6 rounded-2xl w-max"
                                required
                            />
                            <input
                                type="text"
                                name="time"
                                value={step.time}
                                onChange={(e) => handleWorkoutStepChange(index, e)}
                                placeholder="Time *"
                                className="flex-1 bg-gray-200 py-3 px-6 rounded-2xl w-max"
                                required
                            />
                            <input
                                type="text"
                                name="sets"
                                value={step.sets}
                                onChange={(e) => handleWorkoutStepChange(index, e)}
                                placeholder="Sets *"
                                className="flex-1 bg-gray-200 py-3 px-6 rounded-2xl w-max"
                                required
                            />
                            {index > 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeWorkoutStep(index)}
                                    className="text-red-400 py-3 px-6 rounded"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    <div className='flex items-center w-full justify-center'>
                        <button
                            type="button"
                            onClick={addWorkoutStep}
                            className="bg-gray-300 text-white px-4 py-2 rounded-3xl mt-2 cursor-pointer"
                        >
                            + Add More
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <div>
                        <input
                            type="text"
                            name="focus"
                            value={challengeData.focus}
                            onChange={handleInputChange}
                            placeholder="Focus (e.g., Weight Loss, Muscle Gain) *"
                            className={`w-full bg-gray-200 px-4 py-3 rounded-2xl mt-5 ${errors.focus ? 'border-2 border-red-500' : ''}`}
                            required
                        />
                        {errors.focus && <p className="text-red-500 text-sm mt-1">{errors.focus}</p>}
                    </div>
                    
                    <div>
                        <input
                            type="text"
                            name="type"
                            value={challengeData.type}
                            onChange={handleInputChange}
                            placeholder="Challenge Type (e.g., Individual, Group) *"
                            className={`w-full bg-gray-200 px-4 py-3 rounded-2xl mt-5 ${errors.type ? 'border-2 border-red-500' : ''}`}
                            required
                        />
                        {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                    </div>
                </div>

                <div className="flex justify-between mt-4">
                    <button
                        type="button"
                        onClick={prevStep}
                        className="bg-[#815B5B] text-white py-3 px-6 rounded-lg cursor-pointer"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="bg-[#615F77] text-white py-3 px-6 rounded-lg cursor-pointer"
                        onClick={handleSubmit}
                    >
                        Create Challenge
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-max mx-auto p-10 bg-white flex flex-col gap-5">
            <div>
                <p className='text-3xl font-bold text-center'> ADD CHALLENGE</p>
                <div className='p-10 rounded-2xl bg-gray-500 mt-5 w-max'>
                    <form>
                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateChallenge;