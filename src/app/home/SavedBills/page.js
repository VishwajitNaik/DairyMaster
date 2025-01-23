import SavedBill from '@/app/components/SavedBill';
import SavedBillMobile from '@/app/components/MObileView/SavedBill';
const SavedBills = () => {

  return (
    <div className="gradient-bg flex flex-col min-h-screen">
      <SavedBill />
      {/* <SavedBillMobile /> */}
    </div>
  );
};

export default SavedBills;
