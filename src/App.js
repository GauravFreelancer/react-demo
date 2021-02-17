import './App.css';
// import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import User from './components/User/User';
import ManageUser from './components/User/ManageUser';
 

function App() {
  return (
    <BrowserRouter>
      <div className="App">
          <Route path="/" exact component={User}></Route>
          <Switch>
            <Route path="/manage-user/:userId" component={ManageUser}></Route>
            <Route path="/manage-user" component={ManageUser}></Route>
          </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
