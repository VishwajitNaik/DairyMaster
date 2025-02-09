"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

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
  const [buffaloConstants, setBuffaloConstants] = useState({});
  const [cowConstants, setCowConstants] = useState({});
  const [selectedDairyName, setSelectedDairyName] = useState("");
  const [calculatedMilkLiter, setCalculatedMilkLiter] = useState(null);
  const [rates, setRates] = useState([]);


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

  useEffect(() =>{
    const fetchRates = async () =>{
      try {
        const res = await axios.get("/api/sangh/GetRates");

        if(
          Array.isArray(res.data.data) && 
          res.data.data.length > 0
        ) {
          setRates(res.data.data[0]);
        }else{
          console.log("No rates Found");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching rates:", error.message);
        setError("Error fetching rates");
        setLoading(false);
      }
    };
    fetchRates();

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


  useEffect(() =>{
    if(rates && Object.keys(rates).length > 0){
      setBuffaloConstants({
          HF: rates.HighFatB,
          R1: rates.HighRateB,
          LF: rates.LowFatB,
          R2: rates.LowRateB,
          SNF_RANGES: [
            { start: 8.7, end: 9.0, rate: 0.3 },
            { start: 9.0, end: 9.1, rate: 0.15 },
            { start: 9.1, end: 10.0, rate: 0.1 },
          ],
      })
    
    setCowConstants({
      HF: rates.HighFatC,
      R1: rates.HighRateC,
      LF: rates.LowFatC,
      R2: rates.LowRateC,
      SNF_RANGES: [
        { start: 8.2, end: 8.5, rate: 0.3 },
        { start: 8.5, end: 8.6, rate: 0.15 },
        { start: 8.6, end: 9.0, rate: 0.1 },
      ],
    })
    } else{
      console.log("Rates not Yet loaded or empty");
    }
  }, [rates])

  // Calculation functions
  const calculateValues = (X, constants) => {
    const { HF, R1, LF, R2 } = constants;
    const R = (R1 - R2) / (HF - LF);
    const FR = (R1 - (HF - X) * R) - 1;
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

        if (res.status === 200 && res.data.message.includes("Milk record for this session")) {
            // Handle case where milk record already exists
            setError(res.data.alert || "A record for this session and date already exists.");
        } else if (res.status === 201) {
            // Handle successful submission
            setRegisterNo("");
            setSampleNo("");
            setSelectedDairyName("");
            setMilkDetails(initialMilkDetails);
            setCalculatedMilkLiter(null); // Reset calculated milk liter
            setError(null);
            alert(res.data.alert || "Milk entry added successfully.");
        }
    } catch (error) {
        console.error("Error storing milk information:", error.message);
        setError(error.response?.data?.alert || "Failed to submit milk entry.");
    }
};


  return (
    <>
<div className="min-h-screen  flex flex-col items-center justify-center p-4 -mt-8">
  {/* Heading */}
  <div className="text-8xl text-white text-center mb-8 font-bold">
    Owner Milk
  </div>

  {/* Form Container */}
  <div className="bg-gray-800 w-full max-w-6xl rounded-lg shadow-2xl p-6">
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6">
      {/* Column 1 */}
      <div className="bg-gray-700 p-6 rounded-lg flex-1">
        {/* Date, Time, and Sample No */}
        <div className="bg-gray-600 p-4 rounded-lg mb-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center">
              <label htmlFor="currentDate" className="text-white text-lg mr-2">
                दिनांक:
              </label>
              <input
                type="date"
                id="currentDate"
                className="p-2 rounded-md shadow-md bg-gray-500 text-white"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="currentTime" className="text-white text-lg ml-4 mr-2">
                समय:
              </label>
              <select
                id="currentTime"
                className="p-2 rounded-md shadow-md bg-gray-500 text-white"
                value={currentTime}
                onChange={(e) => setCurrentTime(e.target.value)}
                required
              >
                <option value="morning">Morning</option>
                <option value="evening">Evening</option>
              </select>
            </div>
            <div className="flex items-center">
              <label htmlFor="sampleNo" className="text-white text-lg ml-4">
                Sample No:
              </label>
              <input
                type="text"
                id="sampleNo"
                className="w-20 ml-2 p-2 rounded-md shadow-md bg-gray-500 text-white"
                value={sampleNo}
                onChange={(e) => setSampleNo(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* U. Code, Dairy Name, Milk Type, and Quality */}
        <div className="bg-gray-600 p-4 rounded-lg mb-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center">
              <label htmlFor="code" className="text-white text-lg mr-2">
                U. code:
              </label>
              <input
                type="text"
                id="code"
                className="w-24 p-2 rounded-md shadow-md bg-gray-500 text-white"
                value={registerNo}
                onChange={handleRegisterNoChange}
                required
              />
            </div>
            <div className="flex items-center">
              <select
                id="ownerDropdown"
                className="w-48 p-2 rounded-md shadow-md bg-gray-500 text-white"
                value={selectedDairyName}
                onChange={(e) => setSelectedDairyName(e.target.value)}
                required
              >
                <option value="">Choose Dairy...</option>
                {owners.map((user) => (
                  <option key={user.registerNo} value={user.dairyName}>
                    {user.dairyName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <select
                id="milkTypeDropdown"
                name="milkType"
                className="w-32 p-2 rounded-md shadow-md bg-gray-500 text-white"
                value={milkDetails.milkType || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">Milk Type</option>
                <option value="buff">Buff</option>
                <option value="cow">Cow</option>
              </select>
            </div>
            <div className="flex items-center">
              <select
                id="qualityPercentage"
                name="quality"
                className="w-24 p-2 rounded-md shadow-md bg-gray-500 text-white"
                value={milkDetails.quality || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">गुणप्रत</option>
                <option value="G">G</option>
                <option value="B">B</option>
              </select>
            </div>
          </div>
        </div>

        {/* Milk KG, Liter, Smel Liter, Fat, SNF, Rate, and Amount */}
        <div className="bg-gray-600 p-4 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <label htmlFor="milkKG" className="text-white text-lg mb-1">
                Milk KG:
              </label>
              <input
                type="number"
                id="milkKG"
                name="milkKG"
                step="0.1"
                className="p-2 rounded-md shadow-md bg-gray-500 text-white"
                value={milkDetails.milkKG || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="milkLiter" className="text-white text-lg mb-1">
                Milk Liter:
              </label>
              <input
                type="number"
                id="milkLiter"
                name="milkLiter"
                step="0.1"
                className="p-2 rounded-md shadow-md bg-gray-500 text-white"
                value={milkDetails.milkLiter || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="smelLiter" className="text-white text-lg mb-1">
                Smel Liter:
              </label>
              <input
                type="number"
                id="smelLiter"
                name="smelLiter"
                step="0.1"
                className="p-2 rounded-md shadow-md bg-gray-500 text-white"
                value={milkDetails.smelLiter || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="fat" className="text-white text-lg mb-1">
                Fat:
              </label>
              <input
                type="number"
                id="fat"
                name="fat"
                step="0.1"
                className="p-2 rounded-md shadow-md bg-gray-500 text-white"
                value={milkDetails.fat || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="snf" className="text-white text-lg mb-1">
                SNF:
              </label>
              <input
                type="number"
                id="snf"
                name="snf"
                step="0.1"
                className="p-2 rounded-md shadow-md bg-gray-500 text-white"
                value={milkDetails.snf || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="rate" className="text-white text-lg mb-1">
                Rate:
              </label>
              <input
                type="number"
                id="rate"
                name="rate"
                step="0.1"
                className="p-2 rounded-md shadow-md bg-gray-500 text-white"
                value={milkDetails.rate || ""}
                onChange={handleInputChange}
                readOnly
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="amount" className="text-white text-lg mb-1">
                Amount:
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                step="0.1"
                className="p-2 rounded-md shadow-md bg-gray-500 text-white"
                value={milkDetails.amount || ""}
                onChange={handleInputChange}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <button
            type="button"
            onClick={handleSmelLiterChange}
            className="bg-green-500 text-white p-2 rounded-md shadow-md hover:bg-green-700 transition duration-300"
          >
            Calculate Milk Liter
          </button>
          <button
            type="button"
            onClick={handleCalculateRate}
            className="bg-yellow-500 text-white p-2 rounded-md shadow-md hover:bg-yellow-700 transition duration-300"
          >
            Calculate Rate and Amount
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md shadow-md hover:bg-blue-700 transition duration-300"
          >
            Submit
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 mt-4 text-center">{error}</p>
        )}
      </div>

      {/* Column 2 */}
      <div className="bg-gray-700 p-6 rounded-lg w-full md:w-1/3">
        <div className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="senedCen" className="text-white text-lg mb-1">
              पाठवलेले केण:
            </label>
            <input
              type="number"
              id="senedCen"
              name="senedCen"
              className="p-2 rounded-md shadow-md bg-gray-500 text-white"
              value={milkDetails.senedCen || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="acceptedCen" className="text-white text-lg mb-1">
              स्वीकारलेले केण:
            </label>
            <input
              type="number"
              id="acceptedCen"
              name="acceptedCen"
              className="p-2 rounded-md shadow-md bg-gray-500 text-white"
              value={milkDetails.acceptedCen || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="smeledCen" className="text-white text-lg mb-1">
              वासाचे केण:
            </label>
            <input
              type="number"
              id="smeledCen"
              name="smeledCen"
              className="p-2 rounded-md shadow-md bg-gray-500 text-white"
              value={milkDetails.smeledCen || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="bhesalType" className="text-white text-lg mb-1">
              भेसळ प्रकार:
            </label>
            <select
              id="bhesalType"
              name="bhesalType"
              className="p-2 rounded-md shadow-md bg-gray-500 text-white"
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
          <div className="flex flex-col">
            <label htmlFor="precotion" className="text-white text-lg mb-1">
              जबाबदारी:
            </label>
            <input
              type="text"
              id="precotion"
              name="precotion"
              className="p-2 rounded-md shadow-md bg-gray-500 text-white"
              value={milkDetails.precotion || ""}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      </div>
    </form>
  </div>
</div>
    </>
  );
};

export default OwnerMilk;  