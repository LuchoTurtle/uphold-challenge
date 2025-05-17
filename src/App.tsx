import Header from './components/Header/Header';
import CurrencyConverter from './components/CurrencyConverter';
import './App.module.scss'

//TODO add aria
//TODO testes
//TODO check code 
//TODO icon no topo da tab (html)
//TODO duplicated code (no format)
//TODO check warnings
function App() {
  return (
    <>
      <Header />
      <main>
        <h1>Currency Converter</h1>
        <p className="text-paragraph">Unlock global currency conversion with confidence. We provide up-to-date exchange rates and a transparent fee structure, so you can compare and convert with peace of mind and no hidden charges.</p>
        <CurrencyConverter />
      </main>
    </>
  );
}

export default App;
