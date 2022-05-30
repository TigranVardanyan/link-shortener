import {BrowserRouter as Router, Route} from "react-router-dom";
import 'materialize-css'
import {useRoutes} from "./routes";

function App() {
    const routes = useRoutes(false)
    return (
        <Router>
            <div className={'container'}>
                {routes}
            </div>
        </Router>

    );
}

export default App;
