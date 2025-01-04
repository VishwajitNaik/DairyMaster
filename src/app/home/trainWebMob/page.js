import React from 'react'
import AddUserMilk from "../../components/AddUserMilk";
import AddUserOrder from '@/app/components/MObileView/AddUserOrder.js';
import AddUserAdvance from '@/app/components/MObileView/AddUserAdvance';
import BillKapat from '../../components/MObileView/BillKapat.js'

const page = () => {
  return (
    <div>
      <div>
        <AddUserMilk />
      </div>
      <div className='mt-4'>
        <AddUserOrder />
      </div>
      <div className='mt-4'>
        <AddUserAdvance />
      </div>
    </div>
  )
}

export default page
