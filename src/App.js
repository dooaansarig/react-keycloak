import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Keycloak from "keycloak-js";
import axios from "axios";

const TOKEN = "pat-eu1-28801c88-c014-4782-8f1a-6f65eb8aef8e";

let initOptions = {
  url: "http://localhost:8080/",
  realm: "poc",
  clientId: "client",
};
const keycloak = new Keycloak(initOptions);

keycloak
  .init({
    onLoad: "login-required",
    checkLoginIframe: false,
    pkceMethod: "S256",
  })
  .then((authenticated) => {
    if (!authenticated) {
      window.location.reload();
      // console.log("here")
      // ReactDOM.render(<App keycloak={keycloak} />, document.getElementById('root'));
    } else {
      console.log(authenticated);
    }
  })
  .catch((error) => {
    console.error("Keycloak initialization failed", error);
  });

function App() {
  const [userInfo, setUserInfo] = React.useState(null);
  const [load, setLoad] = React.useState(false);
  //const history = useNavigate();

  React.useEffect(() => {
    setTimeout(() => {
      setLoad(true);
    }, 3000);
  }, []);
  React.useEffect(() => {
    console.log(keycloak.authenticated);
    if (keycloak && keycloak.authenticated) {
      // console.log('IDToken');
      //   console.log(keycloak.idTokenParsed.preferred_username);
      //   console.log(keycloak.idTokenParsed.email);
      //   console.log(keycloak.idTokenParsed.name);
      //   console.log(keycloak.idTokenParsed.given_name);
      //   console.log(keycloak.idTokenParsed.family_name);

      keycloak.loadUserInfo().then((userInfo) => {
        setUserInfo(userInfo);
        console.log(userInfo);
        // saveToHubspot({
        //   email: userInfo.email,
        //   firstname: userInfo.family_name,
        //   lastname: userInfo.given_name,
        //   phone: "(555) 555-5555",
        //   company: "HubSpot",
        //   website: "hubspot.com",
        //   lifecyclestage: "marketingqualifiedlead",
        // });
      });
    }
  }, [load]);

  const saveToHubspot = async (data) => {
    const response = await axios.post(
      "http://localhost:3002/api/save",
      data
    );
  };
  return (
    <Router>
      <div>
        <h1>Welcome to the React + Keycloak App</h1>
        <Routes>
          <Route exact path="/" component={HomePage} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/strapidashboard" component={StrapiUser} />
          {/* Catch-all route for non-existent paths */}
          <Route path="*" component={NotFoundPage} />
        </Routes>

        {userInfo && (
          <div>
            <p>Authenticated as {userInfo.name}</p>
            <button onClick={() => keycloak.logout()}>Logout</button>
          </div>
        )}
      </div>
    </Router>
  );
}

{
  /* <div>
<h1>Welcome to the React + Keycloak App</h1>
{userInfo ? (
  <div>
    <p>Authenticated as {userInfo.name}</p>
    <button onClick={() => keycloak.logout()}>Logout</button>
  </div>
) : (
  <p>Loading user info...</p>
)}
</div> */
}
export default App;

function HomePage() {
  return <h2>Home Page</h2>;
}

function Dashboard() {
  return <h2>Dashboard</h2>;
}

function StrapiUser() {
  return <h2>Strapi User</h2>;
}


function NotFoundPage() {
  return <h2>Page Not Found</h2>;
}
