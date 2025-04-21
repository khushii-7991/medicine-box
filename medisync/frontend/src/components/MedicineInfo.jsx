import React, { useState } from 'react';
import { FaUpload, FaSearch, FaSpinner, FaPills } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const MedicineInfo = () => {
    const [medicineName, setMedicineName] = useState('');
    const [medicineImage, setMedicineImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [medicineInfo, setMedicineInfo] = useState(null);
    const [error, setError] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error('Image size should be less than 5MB');
                return;
            }
            setMedicineImage(file);
            setMedicineName('');
            setMedicineInfo(null);
            setError(null);
            // For now, we'll use the image name as the medicine name
            const fileName = file.name.split('.')[0];
            fetchMedicineInfo(fileName);
        }
    };

    const handleNameSearch = (e) => {
        e.preventDefault();
        if (!medicineName.trim()) {
            toast.error('Please enter a medicine name');
            return;
        }
        fetchMedicineInfo(medicineName);
    };

    const fetchMedicineInfo = async (input) => {
        setIsLoading(true);
        setError(null);
        try {
            // First, search for the medicine in RxNorm API
            const searchResponse = await fetch(
                `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(input)}`
            );
            
            if (!searchResponse.ok) {
                throw new Error('Failed to fetch medicine information');
            }

            const searchData = await searchResponse.json();
            
            if (!searchData.drugGroup || !searchData.drugGroup.conceptGroup) {
                throw new Error('No medicine found with that name');
            }

            // Get the first concept group that contains drug information
            const conceptGroup = searchData.drugGroup.conceptGroup.find(
                group => group.conceptProperties
            );

            if (!conceptGroup || !conceptGroup.conceptProperties[0]) {
                throw new Error('No medicine found with that name');
            }

            const medicineData = conceptGroup.conceptProperties[0];

            // Get detailed information about the medicine
            const detailsResponse = await fetch(
                `https://rxnav.nlm.nih.gov/REST/rxcui/${medicineData.rxcui}/allProperties.json?prop=all`
            );

            if (!detailsResponse.ok) {
                throw new Error('Failed to fetch detailed medicine information');
            }

            const detailsData = await detailsResponse.json();
            
            // Extract relevant information
            const info = {
                name: medicineData.name || input,
                purpose: detailsData.propConceptGroup?.propConcept?.[0]?.propValue || 'Information not available',
                dosage: detailsData.propConceptGroup?.propConcept?.find(p => p.propName === 'DOSAGE')?.propValue || 'Information not available',
                prescription: detailsData.propConceptGroup?.propConcept?.find(p => p.propName === 'PRESCRIPTION')?.propValue || 'Information not available',
                sideEffects: detailsData.propConceptGroup?.propConcept?.find(p => p.propName === 'SIDE_EFFECTS')?.propValue || 'Information not available',
                precautions: detailsData.propConceptGroup?.propConcept?.find(p => p.propName === 'PRECAUTIONS')?.propValue || 'Information not available',
                interactions: detailsData.propConceptGroup?.propConcept?.find(p => p.propName === 'INTERACTIONS')?.propValue || 'Information not available',
                storage: detailsData.propConceptGroup?.propConcept?.find(p => p.propName === 'STORAGE')?.propValue || 'Information not available',
                manufacturer: detailsData.propConceptGroup?.propConcept?.find(p => p.propName === 'MANUFACTURER')?.propValue || 'Information not available',
                imageUrl: medicineImage ? URL.createObjectURL(medicineImage) : null
            };

            setMedicineInfo(info);
            toast.success('Medicine information retrieved successfully');
        } catch (err) {
            setError('Failed to fetch medicine information. Please try again.');
            toast.error('Failed to fetch medicine information');
            console.error('Error fetching medicine info:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center gap-2 mb-6">
                <FaPills className="text-2xl text-blue-500" />
                <h2 className="text-2xl font-bold">Medicine Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Image Upload Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="medicine-image"
                    />
                    <label
                        htmlFor="medicine-image"
                        className="cursor-pointer flex flex-col items-center justify-center h-full"
                    >
                        <FaUpload className="text-4xl text-gray-400 mb-4" />
                        <p className="text-gray-600">
                            {medicineImage ? 'Change Image' : 'Upload Medicine Image'}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Upload a clear image of the medicine packaging
                        </p>
                        {medicineImage && (
                            <img
                                src={URL.createObjectURL(medicineImage)}
                                alt="Medicine"
                                className="mt-4 max-h-48 rounded-lg shadow-md"
                            />
                        )}
                    </label>
                </div>

                {/* Name Search Section */}
                <div className="flex flex-col justify-center">
                    <form onSubmit={handleNameSearch} className="space-y-4">
                        <div className="flex">
                            <input
                                type="text"
                                value={medicineName}
                                onChange={(e) => setMedicineName(e.target.value)}
                                placeholder="Enter medicine name"
                                className="flex-1 p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <FaSearch />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500">
                            Or upload an image of the medicine packaging
                        </p>
                    </form>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="text-center py-8">
                    <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto" />
                    <p className="mt-4 text-gray-600">Fetching medicine information...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {/* Medicine Information */}
            {medicineInfo && !isLoading && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {medicineInfo.imageUrl && (
                            <div className="flex justify-center">
                                <img
                                    src={medicineInfo.imageUrl}
                                    alt={medicineInfo.name}
                                    className="max-h-64 rounded-lg shadow-md"
                                />
                            </div>
                        )}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">{medicineInfo.name}</h3>
                            <div>
                                <h4 className="font-medium text-gray-700">Purpose</h4>
                                <p className="text-gray-600">{medicineInfo.purpose}</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700">Dosage</h4>
                                <p className="text-gray-600">{medicineInfo.dosage}</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700">Prescription</h4>
                                <p className="text-gray-600">{medicineInfo.prescription}</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700">Side Effects</h4>
                                <p className="text-gray-600">{medicineInfo.sideEffects}</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700">Precautions</h4>
                                <p className="text-gray-600">{medicineInfo.precautions}</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700">Drug Interactions</h4>
                                <p className="text-gray-600">{medicineInfo.interactions}</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700">Storage</h4>
                                <p className="text-gray-600">{medicineInfo.storage}</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700">Manufacturer</h4>
                                <p className="text-gray-600">{medicineInfo.manufacturer}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicineInfo; 