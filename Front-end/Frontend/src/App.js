import './App.css';
import {Routes, Route} from 'react-router-dom';
import Map from './component/Map';
import MapDetail from './component/MapDetail';
import StatDay from './component/StatDay';
import StatMonth from './component/StatMonth';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='' element={<Map/>}></Route>
        <Route path='/station/:id' element={<MapDetail/>}></Route>
        <Route path='/stat/day/:id' element={<StatDay/>}></Route>
        <Route path='/stat/month/:id' element={<StatMonth/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
