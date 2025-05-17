import Header from './components/Header/Header';
import CurrencyConverter from './components/CurrencyConverter';
import styles from './App.module.scss'; // Import as a module

//TODO testes
function App() {
  return (
    <>
      <Header />
      <main id="main-content" role="main" className={styles.main}>
        <h1 tabIndex={-1} id="page-title">Currency Converter</h1>
        <p className={"text-paragraph"}>
          Unlock global currency conversion with confidence. We provide up-to-date exchange rates and a transparent fee structure, 
          so you can compare and convert with peace of mind and no hidden charges.
        </p>
        <CurrencyConverter />
      </main>
    </>
  );
}

export default App;