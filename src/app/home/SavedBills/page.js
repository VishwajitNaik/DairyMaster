import SavedBill from '@/app/components/SavedBill';
import SavedBillsAggregate from "../../components/SavedBillAggrigate";
const SavedBills = () => {

  return (
    <div>
      <SavedBill />
      <h1>Summary Report</h1>
      <SavedBillsAggregate />
    </div>
  );
};

export default SavedBills;
