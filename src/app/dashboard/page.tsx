"use client";

import { getProfile } from '@/features/profile/api/saveProfile'
import React from 'react'

const DashboardPage = async() => {
  const profile = getProfile();
  console.log(profile);
  return (
    <div>
      <h3>Расчитанные БЖУ:</h3>

    </div>
  )
}

export default DashboardPage