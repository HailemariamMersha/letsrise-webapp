import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import { Fragment } from "react";

const INDUSTRIES = [
  "Technology", "Healthcare", "Finance", "Education", "E-commerce", 
  "Food & Beverage", "Real Estate", "Transportation", "Entertainment", 
  "Manufacturing", "Retail", "Energy", "Agriculture", "Other"
];

const TARGET_AUDIENCES = [
  "Consumers", "Businesses", "Startups", "SMEs", "Enterprises", "Students", "Parents", "Healthcare Providers", "Developers", "Designers", "Investors", "Nonprofits", "Other"
];





const PROJECT_STAGES = [
  "Pre-Idea", "Pre-Launch", "Post-Launch", "Growth"
];

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini (fmr. \"Swaziland\")", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];


// Long role descriptions for dropdown
const IDEAL_ROLES = [
  {
    value: "ceo",
    label: "Chief Executive Officer (CEO) – Visionary leader responsible for overall strategy and direction."
  },
  {
    value: "cto",
    label: "Chief Technology Officer (CTO) – Leads technology and product development."
  },
  {
    value: "cfo",
    label: "Chief Financial Officer (CFO) – Manages finances, fundraising, and growth."
  },
  {
    value: "coo",
    label: "Chief Operating Officer (COO) – Oversees daily operations and execution."
  },
  {
    value: "cmo",
    label: "Chief Marketing Officer (CMO) – Drives marketing, branding, and growth."
  },
  {
    value: "product_manager",
    label: "Product Manager – Defines product vision and manages product lifecycle."
  },
  {
    value: "developer",
    label: "Developer/Engineer – Builds and maintains the product's technology."
  },
  {
    value: "designer",
    label: "Designer – Crafts user experience and visual identity."
  },
  {
    value: "sales",
    label: "Sales Lead – Grows revenue and builds customer relationships."
  },
  {
    value: "marketing",
    label: "Marketing Lead – Creates campaigns and drives user acquisition."
  },
  {
    value: "operations",
    label: "Operations Lead – Ensures smooth business processes."
  },
  {
    value: "idonotknow",
    label: "I don't know yet – I'm still exploring my ideal role."
  },
  {
    value: "other",
    label: "Other (please specify)"
  }
];

const FUNDS_OPTIONS = [
  "None",
  "Less than $5k",
  "$5k–$10k",
  "$10k–$20k",
  "$20k–$50k",
  "$50k–$100k",
  "$100k+"
];

const EDUCATION_OPTIONS = [
  "High School",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "MBA",
  "PhD",
  "Other"
];

// Autocomplete multi-select for industries and target audiences
function useAutocompleteMultiSelect(options, selected, setSelected) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (input) {
      setSuggestions(
        options.filter(
          (opt) =>
            opt.toLowerCase().includes(input.toLowerCase()) &&
            !selected.includes(opt)
        )
      );
    } else {
      setSuggestions([]);
    }
  }, [input, options, selected]);

  const add = (value) => {
    if (value && !selected.includes(value)) {
      setSelected((prev) => [...prev, value]);
      setInput("");
    }
  };
  const remove = (value) => {
    setSelected((prev) => prev.filter((v) => v !== value));
  };
  return { input, setInput, suggestions, add, remove };
}

export default function Survey() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [profileScore, setProfileScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtherIndustry, setShowOtherIndustry] = useState(false);
  const [otherIndustry, setOtherIndustry] = useState("");
  const [showOtherRole, setShowOtherRole] = useState(false);
  const [otherRole, setOtherRole] = useState("");
  const [showLicenseNote, setShowLicenseNote] = useState(false);
  const [showFundingNote, setShowFundingNote] = useState(false);
  const [dynamicIndustries, setDynamicIndustries] = useState([]);
  const [industryInput, setIndustryInput] = useState("");
  const [projectIndustryInput, setProjectIndustryInput] = useState("");
  const [projectIndustries, setProjectIndustries] = useState([]);
  const [targetAudienceInput, setTargetAudienceInput] = useState("");
  const [targetAudiences, setTargetAudiences] = useState([]);
  const [showLicenseHelp, setShowLicenseHelp] = useState(false);
  const [expIndustryInput, setExpIndustryInput] = useState("");
  const [expIndustries, setExpIndustries] = useState([]);
  const [expTargetInput, setExpTargetInput] = useState("");
  const [expTargets, setExpTargets] = useState([]);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    city: "",
    country: "",
    totalFunds: "",
    educationalLevel: "",
    idealRole: "",
    industries: [],
    // Personal Info
    name: "",
    location: "",
    dob: "",
    previousVentures: 0,
    previousYears: 0,
    fundsRaised: "",
    role: "",
    
    // Experience Info
    experiences: [{
      companyName: "",
      role: "",
      industry: "",
      startDate: "",
      endDate: "",
      isStartup: false
    }],
    
    // Current Project Info
    projectName: "",
    projectStage: "",
    isCofounder: false,
    projectRole: "",
    projectIndustry: "",
    primaryCustomer: "",
    projectFundsRaised: "",
    projectLocation: "",
    licenseRegistration: "",
    teamMembers: []
  });

  // Personal Info industries
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const industriesAutocomplete = useAutocompleteMultiSelect(INDUSTRIES, selectedIndustries, setSelectedIndustries);
  // Project Info industries
  const [selectedProjectIndustries, setSelectedProjectIndustries] = useState([]);
  const projectIndustriesAutocomplete = useAutocompleteMultiSelect(INDUSTRIES, selectedProjectIndustries, setSelectedProjectIndustries);
  // Project Info target audience
  const [selectedProjectTargets, setSelectedProjectTargets] = useState([]);
  const projectTargetsAutocomplete = useAutocompleteMultiSelect(TARGET_AUDIENCES, selectedProjectTargets, setSelectedProjectTargets);
  // Experience Info industries
  const [selectedExpIndustries, setSelectedExpIndustries] = useState([]);
  const expIndustriesAutocomplete = useAutocompleteMultiSelect(INDUSTRIES, selectedExpIndustries, setSelectedExpIndustries);
  // Experience Info target audience
  const [selectedExpTargets, setSelectedExpTargets] = useState([]);
  const expTargetsAutocomplete = useAutocompleteMultiSelect(TARGET_AUDIENCES, selectedExpTargets, setSelectedExpTargets);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    calculateProfileScore();
  }, [formData]);

  const calculateProfileScore = () => {
    let score = 0;
    const totalFields = 15; // Total number of important fields

    if (formData.name) score++;
    if (formData.location) score++;
    if (formData.dob) score++;
    if (formData.educationalLevel) score++;
    if (formData.industries.length > 0) score++;
    if (formData.role) score++;
    if (formData.experiences[0]?.companyName) score++;
    if (formData.projectName) score++;
    if (formData.projectStage) score++;
    if (formData.projectRole) score++;
    if (formData.projectIndustry) score++;
    if (formData.primaryCustomer) score++;
    if (formData.projectLocation) score++;
    if (formData.licenseRegistration) score++;
    if (formData.teamMembers.length > 0) score++;

    setProfileScore(Math.round((score / totalFields) * 100));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    const newExperiences = [...formData.experiences];
    newExperiences[index] = {
      ...newExperiences[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      experiences: newExperiences
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experiences: [...prev.experiences, {
        companyName: "",
        role: "",
        industry: "",
        startDate: "",
        endDate: "",
        isStartup: false
      }]
    }));
  };

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
    }));
  };

  const handleIndustryExpertiseChange = (industry) => {
    if (industry === "Other") {
      setShowOtherIndustry(true);
      setFormData(prev => ({
        ...prev,
        industries: prev.industries.filter(i => i !== "Other")
      }));
    } else {
      setShowOtherIndustry(false);
      setOtherIndustry("");
      setFormData(prev => ({
        ...prev,
        industries: prev.industries.includes(industry)
          ? prev.industries.filter(i => i !== industry)
          : [...prev.industries, industry]
      }));
    }
  };

  const handleRoleChange = (value) => {
    if (value === "Other") {
      setShowOtherRole(true);
      setFormData(prev => ({ ...prev, role: "" }));
    } else {
      setShowOtherRole(false);
      setOtherRole("");
      setFormData(prev => ({ ...prev, role: value }));
    }
  };

  const handleLicenseChange = (value) => {
    setFormData(prev => ({ ...prev, licenseRegistration: value }));
    if (value.trim().toLowerCase() === "n/a") {
      setShowLicenseModal(true);
    } else {
      setShowLicenseModal(false);
    }
  };

  const handleFundsRaisedChange = (value, isProject) => {
    if (value === "Less than $5k") {
      setShowFundingNote(true);
    } else {
      setShowFundingNote(false);
    }
    if (isProject) {
      setFormData(prev => ({ ...prev, projectFundsRaised: value }));
    } else {
      setFormData(prev => ({ ...prev, fundsRaised: value }));
    }
  };

  const handleTeamMemberAdd = (email) => {
    if (email && !formData.teamMembers.includes(email)) {
      setFormData(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, email]
      }));
    }
  };

  const handleTeamMemberRemove = (email) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(member => member !== email)
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const surveyData = {
        ...formData,
        userId: user.uid,
        userEmail: user.email,
        submittedAt: new Date(),
        profileScore
      };

      await setDoc(doc(db, "surveys", user.uid), surveyData);
      router.push("/assessment");
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("Error submitting survey. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for required field validation with missing fields list
  const getPersonalInfoMissingFields = () => {
    const missing = [];
    if (!formData.firstName) missing.push("First Name");
    if (!formData.lastName) missing.push("Last Name");
    if (!formData.country) missing.push("Country");
    if (!formData.city) missing.push("City");
    if (!formData.totalFunds) missing.push("Total Funds Raised");
    if (!formData.educationalLevel) missing.push("Educational Level");
    if (!formData.idealRole) missing.push("Ideal Role");
    if (selectedIndustries.length === 0) missing.push("Industries");
    return missing;
  };
  const getProjectInfoMissingFields = () => {
    const missing = [];
    if (!formData.projectName) missing.push("Project Name");
    if (!formData.projectStage) missing.push("Project Stage");
    if (!formData.projectRole) missing.push("Project Role");
    if (selectedProjectIndustries.length === 0) missing.push("Project Industries");
    if (selectedProjectTargets.length === 0) missing.push("Target Audience");
    if (!formData.projectLocation) missing.push("Project Location");
    return missing;
  };
  const getExperienceInfoMissingFields = () => {
    const missing = [];
    formData.experiences.forEach((exp, idx) => {
      if (!exp.companyName) missing.push(`Experience ${idx + 1}: Company Name`);
      if (!exp.role) missing.push(`Experience ${idx + 1}: Role`);
      if (selectedExpIndustries.length === 0) missing.push(`Experience ${idx + 1}: Industries`);
      if (selectedExpTargets.length === 0) missing.push(`Experience ${idx + 1}: Target Audience`);
    });
    return missing;
  };

  // Dynamic industry add
  const handleIndustryInput = (e) => {
    setIndustryInput(e.target.value);
  };
  const handleAddIndustry = () => {
    if (industryInput && !formData.industries.includes(industryInput)) {
      setFormData(prev => ({
        ...prev,
        industries: [...prev.industries, industryInput]
      }));
      setIndustryInput("");
    }
  };
  const handleRemoveIndustry = (industry) => {
    setFormData(prev => ({
      ...prev,
      industries: prev.industries.filter(i => i !== industry)
    }));
  };

  // Dynamic add for project industry
  const handleProjectIndustryInput = (e) => setProjectIndustryInput(e.target.value);
  const handleAddProjectIndustry = () => {
    if (projectIndustryInput && !projectIndustries.includes(projectIndustryInput)) {
      setProjectIndustries(prev => [...prev, projectIndustryInput]);
      setFormData(prev => ({ ...prev, projectIndustry: projectIndustryInput }));
      setProjectIndustryInput("");
    }
  };
  const handleRemoveProjectIndustry = (industry) => {
    setProjectIndustries(prev => prev.filter(i => i !== industry));
    if (formData.projectIndustry === industry) setFormData(prev => ({ ...prev, projectIndustry: "" }));
  };

  // Dynamic add for target audience
  const handleTargetAudienceInput = (e) => setTargetAudienceInput(e.target.value);
  const handleAddTargetAudience = () => {
    if (targetAudienceInput && !targetAudiences.includes(targetAudienceInput)) {
      setTargetAudiences(prev => [...prev, targetAudienceInput]);
      setFormData(prev => ({ ...prev, primaryCustomer: targetAudienceInput }));
      setTargetAudienceInput("");
    }
  };
  const handleRemoveTargetAudience = (aud) => {
    setTargetAudiences(prev => prev.filter(i => i !== aud));
    if (formData.primaryCustomer === aud) setFormData(prev => ({ ...prev, primaryCustomer: "" }));
  };

  // License registration modal popup
  const handleLicenseRegistrationBlur = () => {
    if (!formData.licenseRegistration || formData.licenseRegistration.toLowerCase() === "n/a") {
      setShowLicenseHelp(true);
    } else {
      setShowLicenseHelp(false);
    }
  };

  // Dynamic add for experience industry
  const handleExpIndustryInput = (e) => setExpIndustryInput(e.target.value);
  const handleAddExpIndustry = (idx) => {
    if (expIndustryInput && !expIndustries.includes(expIndustryInput)) {
      setExpIndustries(prev => [...prev, expIndustryInput]);
      handleExperienceChange(idx, "industry", expIndustryInput);
      setExpIndustryInput("");
    }
  };
  const handleRemoveExpIndustry = (industry) => {
    setExpIndustries(prev => prev.filter(i => i !== industry));
  };

  // Dynamic add for experience target audience
  const handleExpTargetInput = (e) => setExpTargetInput(e.target.value);
  const handleAddExpTarget = (idx) => {
    if (expTargetInput && !expTargets.includes(expTargetInput)) {
      setExpTargets(prev => [...prev, expTargetInput]);
      handleExperienceChange(idx, "targetAudience", expTargetInput);
      setExpTargetInput("");
    }
  };
  const handleRemoveExpTarget = (aud) => {
    setExpTargets(prev => prev.filter(i => i !== aud));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Quick Survey Note */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">Quick survey to get you started</h2>
          <p className="text-gray-600">Answer a few questions to unlock personalized matches, news, and opportunities. Your answers help us serve you better!</p>
        </div>
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Profile Completion: {profileScore}%
            </span>
            <span className="text-sm text-gray-500">
              Step {currentStep} of 3
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Personal Info */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
            <p className="text-gray-500 mb-4">Tell us about yourself. <span className="text-blue-600">This helps us match you with the right opportunities!</span></p>
            {validationError && (
              <div className="mb-4 text-red-600 font-medium">{validationError}</div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your last name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <select
                  value={formData.country}
                  onChange={e => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select your country</option>
                  {COUNTRIES.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your city"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Funds Raised *</label>
                <select
                  value={formData.totalFunds}
                  onChange={e => setFormData(prev => ({ ...prev, totalFunds: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select amount</option>
                  {FUNDS_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
          <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Educational Level *</label>
                <select
                  value={formData.educationalLevel}
                  onChange={e => setFormData(prev => ({ ...prev, educationalLevel: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select level</option>
                  {EDUCATION_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">What's your ideal role? *</label>
                <select
                  value={formData.idealRole}
                  onChange={e => setFormData(prev => ({ ...prev, idealRole: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select your ideal role</option>
                  {IDEAL_ROLES.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Industries *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={industriesAutocomplete.input}
                    onChange={e => industriesAutocomplete.setInput(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type to search and add industries"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        industriesAutocomplete.add(industriesAutocomplete.input);
                      }
                    }}
                  />
                  {industriesAutocomplete.suggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border border-gray-200 rounded-md mt-1 w-full max-h-40 overflow-y-auto">
                      {industriesAutocomplete.suggestions.map((opt, idx) => (
                        <li
                          key={idx}
                          className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                          onClick={() => industriesAutocomplete.add(opt)}
                        >
                          {opt}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {selectedIndustries.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedIndustries.map((industry, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center">
                        {industry}
                        <button
                          type="button"
                          className="ml-2 text-blue-500 hover:text-red-500"
                          onClick={() => industriesAutocomplete.remove(industry)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => {
                  const missing = getPersonalInfoMissingFields();
                  if (missing.length > 0) {
                    setValidationError(`Please fill in: ${missing.join(", ")}`);
                  } else {
                    setValidationError("");
                    setCurrentStep(2);
                  }
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Next: Current Project Info
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Current Project Info */}
        {currentStep === 2 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Project Information</h2>
            <p className="text-gray-500 mb-4">Share details about your current project. <span className="text-green-600">This helps us connect you with the right resources!</span></p>
            {validationError && (
              <div className="mb-4 text-red-600 font-medium">{validationError}</div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => handleInputChange("projectName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your project name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Stage *</label>
                <select
                  value={formData.projectStage}
                  onChange={(e) => handleInputChange("projectStage", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select project stage</option>
                  {PROJECT_STAGES.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">What's your role in this project? *</label>
                <select
                  value={formData.projectRole}
                  onChange={e => handleInputChange("projectRole", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select your role</option>
                  {IDEAL_ROLES.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={projectIndustriesAutocomplete.input}
                    onChange={e => projectIndustriesAutocomplete.setInput(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type to search and add industries"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        projectIndustriesAutocomplete.add(projectIndustriesAutocomplete.input);
                      }
                    }}
                  />
                  {projectIndustriesAutocomplete.suggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border border-gray-200 rounded-md mt-1 w-full max-h-40 overflow-y-auto">
                      {projectIndustriesAutocomplete.suggestions.map((opt, idx) => (
                        <li
                          key={idx}
                          className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                          onClick={() => projectIndustriesAutocomplete.add(opt)}
                        >
                          {opt}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {selectedProjectIndustries.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedProjectIndustries.map((industry, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center">
                        {industry}
                        <button
                          type="button"
                          className="ml-2 text-blue-500 hover:text-red-500"
                          onClick={() => projectIndustriesAutocomplete.remove(industry)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={projectTargetsAutocomplete.input}
                    onChange={e => projectTargetsAutocomplete.setInput(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type to search and add target audiences"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        projectTargetsAutocomplete.add(projectTargetsAutocomplete.input);
                      }
                    }}
                  />
                  {projectTargetsAutocomplete.suggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border border-gray-200 rounded-md mt-1 w-full max-h-40 overflow-y-auto">
                      {projectTargetsAutocomplete.suggestions.map((opt, idx) => (
                        <li
                          key={idx}
                          className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                          onClick={() => projectTargetsAutocomplete.add(opt)}
                        >
                          {opt}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {selectedProjectTargets.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedProjectTargets.map((aud, idx) => (
                      <span key={idx} className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center">
                        {aud}
                        <button
                          type="button"
                          className="ml-2 text-green-500 hover:text-red-500"
                          onClick={() => projectTargetsAutocomplete.remove(aud)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Funds Raised</label>
                <select
                  value={formData.projectFundsRaised}
                  onChange={e => handleFundsRaisedChange(e.target.value, true)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select amount</option>
                  {FUNDS_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {showFundingNote && (
                  <div className="text-xs text-green-600 mt-1">Many startups have succeeded without raising any fund. Keep going!</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <select
                  value={formData.projectLocation}
                  onChange={(e) => handleInputChange("projectLocation", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select location</option>
                  {COUNTRIES.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
          <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">License Registration</label>
                <input
                  type="text"
                  value={formData.licenseRegistration}
                  onChange={e => handleLicenseChange(e.target.value)}
                  onBlur={handleLicenseRegistrationBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter license registration details or N/A"
                  list="license-options"
                />
                <datalist id="license-options">
                  <option value="N/A" />
                </datalist>
                {showLicenseNote && (
                  <div className="text-xs text-blue-600 mt-1">Our platform has resources to help you with license registration!</div>
                )}
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={formData.isCofounder}
                  onChange={(e) => handleInputChange("isCofounder", e.target.checked)}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">Are you part of the founding team?</label>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Members (Invite them to the project)
              </label>
              <div className="flex gap-2 mb-4">
                <input
                  type="email"
                  placeholder="Enter team member email"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleTeamMemberAdd(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    const input = e.target.previousElementSibling;
                    handleTeamMemberAdd(input.value);
                    input.value = '';
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              
              {formData.teamMembers.length > 0 && (
                <div className="space-y-2">
                  {formData.teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                      <span className="text-sm text-gray-700">{member}</span>
                      <button
                        onClick={() => handleTeamMemberRemove(member)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => {
                  setValidationError("");
                  setCurrentStep(1);
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => {
                  const missing = getProjectInfoMissingFields();
                  if (missing.length > 0) {
                    setValidationError(`Please fill in: ${missing.join(", ")}`);
                  } else {
                    setValidationError("");
                    setCurrentStep(3);
                  }
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Next: Experience Info
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Experience Info */}
        {currentStep === 3 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Experience Information</h2>
            <p className="text-gray-500 mb-4">Share your previous work experience. <span className="text-purple-600">This helps us understand your background and connect you with the right people!</span></p>
            {validationError && (
              <div className="mb-4 text-red-600 font-medium">{validationError}</div>
            )}
            {formData.experiences.map((experience, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Experience {index + 1}
                  </h3>
                  {formData.experiences.length > 1 && (
                    <button
                      onClick={() => removeExperience(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      value={experience.companyName}
                      onChange={(e) => handleExperienceChange(index, "companyName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter company name"
                    />
                  </div>
          <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select
                      value={experience.role}
                      onChange={(e) => handleExperienceChange(index, "role", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select your role</option>
                      {IDEAL_ROLES.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
              </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={expIndustriesAutocomplete.input}
                        onChange={e => expIndustriesAutocomplete.setInput(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type to search and add industries"
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            expIndustriesAutocomplete.add(expIndustriesAutocomplete.input);
                          }
                        }}
                      />
                      {expIndustriesAutocomplete.suggestions.length > 0 && (
                        <ul className="absolute z-10 bg-white border border-gray-200 rounded-md mt-1 w-full max-h-40 overflow-y-auto">
                          {expIndustriesAutocomplete.suggestions.map((opt, idx) => (
                            <li
                              key={idx}
                              className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                              onClick={() => expIndustriesAutocomplete.add(opt)}
                            >
                              {opt}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {selectedExpIndustries.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedExpIndustries.map((industry, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center">
                            {industry}
                            <button
                              type="button"
                              className="ml-2 text-blue-500 hover:text-red-500"
                              onClick={() => expIndustriesAutocomplete.remove(industry)}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={expTargetsAutocomplete.input}
                        onChange={e => expTargetsAutocomplete.setInput(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type to search and add target audiences"
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            expTargetsAutocomplete.add(expTargetsAutocomplete.input);
                          }
                        }}
                      />
                      {expTargetsAutocomplete.suggestions.length > 0 && (
                        <ul className="absolute z-10 bg-white border border-gray-200 rounded-md mt-1 w-full max-h-40 overflow-y-auto">
                          {expTargetsAutocomplete.suggestions.map((opt, idx) => (
                            <li
                              key={idx}
                              className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                              onClick={() => expTargetsAutocomplete.add(opt)}
                            >
                              {opt}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {selectedExpTargets.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedExpTargets.map((aud, idx) => (
                          <span key={idx} className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center">
                            {aud}
                            <button
                              type="button"
                              className="ml-2 text-green-500 hover:text-red-500"
                              onClick={() => expTargetsAutocomplete.remove(aud)}
                            >
                              ×
                            </button>
                          </span>
                        ))}
          </div>
        )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={experience.startDate}
                      onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={experience.endDate}
                      onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={experience.isStartup}
                      onChange={(e) => handleExperienceChange(index, "isStartup", e.target.checked)}
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-700">Is this a startup?</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={experience.currentlyWorking || false}
                      onChange={(e) => handleExperienceChange(index, "currentlyWorking", e.target.checked)}
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-700">Currently working here?</label>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addExperience}
              className="mb-6 px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              + Add Another Experience
            </button>
            <div className="flex justify-between">
          <button
                onClick={() => {
                  setValidationError("");
                  setCurrentStep(2);
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <button
                onClick={async () => {
                  const missing = getExperienceInfoMissingFields();
                  if (missing.length > 0) {
                    setValidationError(`Please fill in: ${missing.join(", ")}`);
                    return;
                  }
                  setValidationError("");
                  await handleSubmit();
                }}
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Survey"}
          </button>
        </div>
          </div>
        )}
      </div>
      {/* License Registration Help Modal (simple React + Tailwind) */}
      {showLicenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowLicenseModal(false)}
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-4">Need help with license registration?</h2>
            <p className="mb-6 text-gray-600">Would you like some help from our platform with your license registration?</p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700"
                onClick={() => setShowLicenseModal(false)}
              >
                Yes, I want help
              </button>
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-semibold hover:bg-gray-300"
                onClick={() => setShowLicenseModal(false)}
              >
                No, thanks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}