import React from 'react'
import GetUserMilk from '@/app/components/GetUserMilk'
import AggregateMilk from '@/app/components/AggrigateTotal'

const page = () => {
  return (
    <div className="gradient-bg flex flex-col items-center justify-center min-h-screen">
      {/* <GetUserMilk /> */}
      <AggregateMilk />
    </div>
  )
}

export default page
