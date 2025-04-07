import React from 'react';
import FirmsFireList from '../components/FirmsFireList';
import AlertList from '../components/AlertList';
import GeeDataDisplay from '../components/GeeDataDisplay';

function DashboardPage() {
  return (
    <div className="container py-5">
      <h1 className="text-center mb-5 text-primary">Dashboard Principal</h1>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-danger text-white">Focos Activos</div>
            <div className="card-body">
              <p>Monitorea los focos de calor detectados en tiempo real.</p>
              <FirmsFireList />
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-warning text-dark">Alertas</div>
            <div className="card-body">
              <p>Revisa las alertas más recientes generadas por el sistema.</p>
              <AlertList />
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">Análisis Histórico</div>
            <div className="card-body">
              <p>Explora datos históricos y tendencias clave.</p>
              <GeeDataDisplay />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;