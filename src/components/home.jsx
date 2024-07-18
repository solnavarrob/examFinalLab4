import logo from './logo-utn.png';

export default function Home() {
  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f0f0f0', color: 'black' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <img src={logo} alt="Logo" style={{ width: '800px', height: 'auto' }} />
        <h1 className="mt-5">Universidad Tecnológica Nacional</h1>
        <p className="lead">Sistema de Inscripción a Mesas de Exámenes</p>
      </div>
    </div>
  );
}