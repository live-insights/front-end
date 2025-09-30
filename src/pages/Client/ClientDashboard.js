import React from 'react';
import { Outlet } from 'react-router-dom';
import HeaderTop from '../../components/HeaderTop'; 

const ClientDashboard = () => {

  return (
    <div className="layout">
      <HeaderTop />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default ClientDashboard;
