"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import AddOrders from "../AddOrders/page"

const OwnerMilk = () => {
  const { id } = useParams();
  const [registerNo, setRegisterNo] = useState("");
  const [sampleNo, setSampleNo] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("morning");
  const [selectedOption, setSelectedOption] = useState("");
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDairyName, setSelectedDairyName] = useState("");
  const [calculatedMilkLiter, setCalculatedMilkLiter] = useState(null);

  const initialMilkDetails = {
    quality: "",
    milkKG: "",
    milkLiter: "",
    smelLiter: "",
    fat: "",
    snf: "",
    rate: "",
    amount: "",
    senedCen: "",
    acceptedCen: "",
    smeledCen: "",
    bhesalType: "",
    precotion: "",
  };

  const [milkDetails, setMilkDetails] = useState(initialMilkDetails);

  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toISOString().split("T")[0]; // yyyy-mm-dd format
    const formattedTime = date.getHours() < 12 ? "morning" : "evening";

    setCurrentDate(formattedDate);
    setCurrentTime(formattedTime);
  }, []);

  // Fetch owners
  useEffect(() => {
    const getOwners = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/sangh/getOwners");
        setOwners(res.data.data);
      } catch (error) {
        setError("Failed to fetch owners.");
        console.error("Failed to fetch owners:", error.message);
      } finally {
        setLoading(false);
      }
    };
    getOwners();
  }, []);

  // Set current date
  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toISOString().split("T")[0];
    setCurrentDate(formattedDate);
  }, []);

  // Handle smelLiter change and calculate milkLiter
  const handleSmelLiterChange = (e) => {
    const smelLiterValue = parseFloat(e.target.value) || 0;
    const originalMilkLiter = parseFloat(milkDetails.milkLiter) || 0;

    const updatedMilkLiter = originalMilkLiter - smelLiterValue;

    setMilkDetails((prevDetails) => ({
      ...prevDetails,
      smelLiter: smelLiterValue,
      milkLiter: updatedMilkLiter >= 0 ? updatedMilkLiter.toFixed(2) : "0.00",
    }));
  };

  // Handle register number selection
  const handleRegisterNoChange = (event) => {
    const value = event.target.value;
    setRegisterNo(value);
    setSelectedOption(value);

    const owner = owners.find(
      (owner) => owner.registerNo === parseInt(value, 10)
    );
    if (owner) {
      setSelectedDairyName(owner.dairyName);
    } else {
      setSelectedDairyName("");
    }
  };

  // Handle milk details input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMilkDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  // Handle milkLiter calculation via button click
  const handleCalculateMilkLiter = () => {
    const originalMilkLiter = parseFloat(milkDetails.milkLiter) || 0;
    const smelLiter = parseFloat(milkDetails.smelLiter) || 0;

    const updatedMilkLiter = originalMilkLiter - smelLiter;

    // Ensure milkLiter cannot go negative
    setCalculatedMilkLiter(
      updatedMilkLiter >= 0 ? updatedMilkLiter.toFixed(2) : "0.00"
    );
  };

  // Constants for calculating rates
  const buffaloConstants = {
    HF: 15,
    R1: 78.40,
    LF: 5.5,
    R2: 48.90,
    SNF_RANGES: [
      { start: 8.7, end: 9.0, rate: 0.3 },
      { start: 9.0, end: 9.1, rate: 0.1 },
      { start: 9.1, end: 10.0, rate: 0.05 },
    ],
  };

  const cowConstants = {
    HF: 5,
    R1: 33.90,
    LF: 3,
    R2: 29.40,
    SNF_RANGES: [
      { start: 8.2, end: 8.5, rate: 0.3 },
      { start: 8.5, end: 8.6, rate: 0.10 },
      { start: 8.6, end: 9.0, rate: 0.05 },
    ],
  };

  // Calculation functions
  const calculateValues = (X, constants) => {
    const { HF, R1, LF, R2 } = constants;
    const R = (R1 - R2) / (HF - LF);
    const FR = R1 - (HF - X) * R;
    return FR;
  };

  const calculateTotalRate = (X, Y) => {
    const constants = X >= 5.5 ? buffaloConstants : cowConstants;
    const FR = calculateValues(X, constants);
    let TFR = FR;

    constants.SNF_RANGES.forEach((range) => {
      if (Y >= range.start && Y <= range.end) {
        const SNFRate = 10 * (Y - range.start) * range.rate;
        TFR += SNFRate;
      } else if (Y > range.end) {
        const SNFRate = 10 * (range.end - range.start) * range.rate;
        TFR += SNFRate;
      }
    });

    return TFR;
  };

  // Handle total rate calculation
  const calculateRates = () => {
    const fatInput = parseFloat(milkDetails.fat || "0");
    const snfInput = parseFloat(milkDetails.snf || "0");
    const liter = parseFloat(calculatedMilkLiter || milkDetails.milkLiter || "0");

    const rate = calculateTotalRate(fatInput, snfInput);
    const amount = liter * rate;

    setMilkDetails((prevDetails) => ({
      ...prevDetails,
      rate: rate.toFixed(2),
      amount: amount.toFixed(2),
    }));
  };

  // Trigger rate calculation via button click
  const handleCalculateRate = () => {
    calculateRates();
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const allFieldsFilled =
      Object.values(milkDetails).every((x) => x !== "") &&
      registerNo &&
      sampleNo &&
      selectedDairyName;

    if (!allFieldsFilled) {
      setError("Please fill all required fields.");
      return;
    }

    const payload = {
      registerNo: parseInt(registerNo, 10),
      sampleNo: parseInt(sampleNo, 10),
      session: currentTime,
      dairyName: selectedDairyName,
      ...milkDetails,
      milkLiter: calculatedMilkLiter || milkDetails.milkLiter,
      date: new Date(currentDate),
    };

    try {
      const res = await axios.post("/api/sangh/MakeMilk", payload);
      setRegisterNo("");
      setSampleNo("");
      setSelectedDairyName("");
      setMilkDetails(initialMilkDetails);
      setCalculatedMilkLiter(null); // Reset calculated milk liter
      setError(null);
    } catch (error) {
      console.error("Error storing milk information:", error.message);
      setError("Failed to submit milk entry.");
    }
  };

  return (
    <>
    <div className="text-8xl text-white text-center" >Owner Milk</div>
      <div className="flex justify-center min-h-screen items-center bg-gray-900">
        <div className="bg-gray-800 w-[80%] h-[40%] p-4">
          <form onSubmit={handleSubmit} className="flex flex-row">
            {/* Col 1 with three rows */}
            <div className="bg-gray-300 w-[70%] p-4 text-black">
              <div className="bg-gray-200 p-2 mb-2">
                <div className="flex flex-row items-center">
                  <label htmlFor="currentDate" className="text-xl mr-2">
                    दिनांक:
                  </label>
                  <input
                    type="date"
                    id="currentDate"
                    className="ml-2 p-1 rounded-md shadow-md text-black"
                    value={currentDate}
                    onChange={(e) => setCurrentDate(e.target.value)}
                    max={new Date().toISOString().split("T")[0]} // Restrict future dates
                    required
                  />
                  <label htmlFor="currentTime" className="text-xl ml-4 mr-2">
                    समय:
                  </label>
                  <select
                    id="currentTime"
                    className="ml-2 p-1 rounded-md shadow-md text-black"
                    value={currentTime}
                    onChange={(e) => setCurrentTime(e.target.value)}
                    required
                  >
                    <option value="morning">Morning</option>
                    <option value="evening">Evening</option>
                  </select>
                  <label htmlFor="sampleNo" className="ml-5">
                    Sample No
                  </label>
                  <input
                    type="text"
                    id="sampleNo"
                    className="w-12 ml-3 mr-4 text-black rounded-md shadow-lg"
                    value={sampleNo}
                    onChange={(e) => setSampleNo(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="bg-gray-200 p-2 mb-2">
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                  <div className="flex items-center">
                    <label htmlFor="code" className="ml-12 mr-2">
                      U. code:
                    </label>
                    <input
                      type="text"
                      id="code"
                      step="0.1"
                      className="w-24 mr-4 text-black rounded-md shadow-lg p-1"
                      value={registerNo}
                      onChange={handleRegisterNoChange}
                      required
                    />
                    <select
                      className="block text-black w-48 rounded-md shadow-lg p-1"
                      id="ownerDropdown"
                      value={selectedDairyName}
                      onChange={(e) => setSelectedDairyName(e.target.value)}
                      required
                    >
                      <option value="">Choose...</option>
                      {owners.map((user) => (
                        <option key={user.registerNo} value={user.dairyName}>
                          {user.dairyName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col items-center">
                    <select
                      className="block text-black w-32 rounded-md shadow-lg p-1"
                      id="milkTypeDropdown"
                      name="milkType"
                      value={milkDetails.milkType || ""}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Milk Type</option>
                      <option value="buff">Buff</option>
                      <option value="cow">Cow</option>
                    </select>
                  </div>
                  <div className="block text-black w-32 rounded-md shadow-lg p-1">
                    <select
                      className="block text-black w-24 rounded-md shadow-lg p-1"
                      id="qualityPercentage"
                      name="quality"
                      value={milkDetails.quality || ""}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">गुणप्रत </option>
                      <option value="G">G</option>
                      <option value="B">B</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-200 p-2">
  <div className="flex flex-col md:flex-row mt-4 space-y-4 md:space-y-0 md:space-x-4">
    {/* Milk KG Input */}
    <div className="flex flex-col items-start">
  <label htmlFor="milkKG" className="mb-1">Milk KG:</label>
  <input
    type="number"
    id="milkKG"
    name="milkKG"
    step="0.1"
    className="w-20 text-black rounded-md shadow-lg p-1"
    value={milkDetails.milkKG || ""}
    onChange={handleInputChange} // This will automatically calculate milkLiter
    required
  />
</div>


    {/* Milk Liter Input */}
    <div className="flex flex-col items-start">
  <label htmlFor="milkLiter" className="mb-1">Milk Liter:</label>
  <input
    type="number"
    id="milkLiter"
    name="milkLiter"
    step="0.1"
    className="w-20 text-black rounded-md shadow-lg p-1"
    value={milkDetails.milkLiter || ""}
    onChange={handleInputChange} // Optional, but user can still manually change it
    required
  />
</div>


    {/* Smel Liter Input */}
    <div className="flex flex-col items-start">
  <label htmlFor="smelLiter" className="mb-1">Smel Liter:</label>
  <input
    type="number"
    step="0.1"
    id="smelLiter"
    name="smelLiter"
    className="w-20 text-black rounded-md shadow-lg p-1"
    value={milkDetails.smelLiter || ""}
    onChange={handleSmelLiterChange} // Use the new handler
    
  />
</div>



    {/* Fat Input */}
    <div className="flex flex-col items-start">
      <label htmlFor="fat" className="mb-1">Fat:</label>
      <input
        type="number"
        id="fat"
        step="0.1"
        name="fat"
        className="w-20 text-black rounded-md shadow-lg p-1"
        value={milkDetails.fat || ""}
        onChange={handleInputChange}
        required
      />
    </div>

    {/* SNF Input */}
    <div className="flex flex-col items-start">
      <label htmlFor="snf" className="mb-1">SNF:</label>
      <input
        type="number"
        id="snf"
        step="0.1"
        name="snf"
        className="w-20 text-black rounded-md shadow-lg p-1"
        value={milkDetails.snf || ""}
        onChange={handleInputChange}
        required
      />
    </div>

    {/* Rate Input */}
    <div className="flex flex-col items-start">
      <label htmlFor="rate" className="mb-1">Rate:</label>
      <input
        type="number"
        id="rate"
        name="rate"
        step="0.1"
        className="w-20 text-black rounded-md shadow-lg p-1"
        value={milkDetails.rate || ""}
        onChange={handleInputChange}
        readOnly
      />
    </div>

    {/* Amount Input */}
    <div className="flex flex-col items-start">
      <label htmlFor="amount" className="mb-1">Amount:</label>
      <input
        type="number"
        id="amount"
        name="amount"
        step="0.1"
        className="w-20 text-black rounded-md shadow-lg p-1"
        value={milkDetails.amount || ""}
        onChange={handleInputChange}
        readOnly
      />
    </div>
  </div>
</div>



<div className="bg-gray-200 p-2 flex flex-col">
  <div className="flex space-x-4 mb-4">
    <button type="button" onClick={handleSmelLiterChange} className="bg-green-500 text-white p-2 rounded-md shadow-md hover:bg-green-700 transition duration-300">
      Calculate Milk Liter
    </button>
    <button type="button" onClick={handleCalculateRate} className="bg-yellow-500 text-white p-2 rounded-md shadow-md hover:bg-yellow-700 transition duration-300">
      Calculate Rate and Amount
    </button>
    <button
      type="submit"
      className="bg-blue-500 text-white p-2 rounded-md shadow-md hover:bg-blue-700 transition duration-300"
    >
      Submit
    </button>
  </div>
  <label>
    Calculated Milk Liter: {milkDetails.milkLiter}
  </label>
  {error && <p className="text-red-500 mt-4">{error}</p>}
</div>

            </div>
            

            {/* Col 2 */}
            <div className="flex flex-col space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex flex-row ml-4 hover:bg-gray-700 rounded-md items-center">
                  <label htmlFor="senedCen" className="m-4">
                    पाठवलेले केण
                  </label>
                  <input
                    type="number"
                    id="senedCen"
                    name="senedCen"
                    className="w-20 text-black rounded-md shadow-lg p-1 ml-12"
                    value={milkDetails.senedCen || ""}
                    onChange={handleInputChange} 
                    required
                  />
                </div>
                <div className="flex flex-row hover:bg-gray-700 items-center">
                  <label htmlFor="senedCen" className="m-4">
                    स्वीकारलेले केण 
                  </label>
                  <input
                    type="number"
                    id="acceptedCen"
                    name="acceptedCen"
                    className="w-20 text-black rounded-md shadow-lg p-1 ml-8"
                    value={milkDetails.acceptedCen || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-row hover:bg-gray-700 items-center">
                  <label htmlFor="senedCen" className="m-4">
                    वासाचे केण 
                  </label>
                  <input
                    type="number"
                    id="smeledCen"
                    name="smeledCen"
                    className="w-20 text-black rounded-md shadow-lg p-1 ml-16"
                    value={milkDetails.smeledCen || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-row hover:bg-gray-700 items-center">
                  <label htmlFor="senedCen" className="m-4">
                    भेसळ प्रकार
                  </label>
                  <select
                    id="bhesalType"
                    name="bhesalType"
                    className="w-24 text-black rounded-md shadow-lg p-1 ml-10"
                    value={milkDetails.bhesalType || ""}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="chemical">Chemical</option>
                    <option value="water">Water</option>
                    <option value="NA">NA</option>
                  </select>
                </div>
                <div className="flex flex-row hover:bg-gray-700 items-center">
                  <label htmlFor="senedCen" className="m-4">
                    जबाबदारी
                  </label>
                  <input
                    type="text"
                    id="precotion"
                    name="precotion"
                    className="w-24 text-black rounded-md shadow-lg p-1 ml-12"
                    value={milkDetails.precotion || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
            </div>
          </form>
        </div>
      </div>

      <AddOrders />

    
    </>
  );
};

export default OwnerMilk;  