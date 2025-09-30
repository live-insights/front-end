import React from 'react';
import { Outlet } from 'react-router-dom';
import HeaderTop from '../../components/HeaderTop'; 

const ClientDashboard = () => {

  return (
    <main>
      <HeaderTop />
      <div className="layout">
      <main>
        <Outlet />
      </main>
    </div>
    </main>
  );
};

export default ClientDashboard;
