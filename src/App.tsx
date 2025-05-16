import Header from './components/Header/Header';
import CurrencyConverter from './components/CurrencyConverter';

//TODO add aria
//TODO toggler
//TODO icon no topo da tab
//TODO testes
//TODO import from barrel files
function App() {
  return (
    <>
      <Header />
      <main>
        <CurrencyConverter />
      </main>
    </>
  );
}

export default App;
