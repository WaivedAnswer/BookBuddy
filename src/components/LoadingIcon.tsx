import logo from '../logo.svg';


function LoadingIcon( ) {

    return ( 
    <div className="loading-icon">
        <img src={logo} className="App-logo" alt="logo" />
        Loading...
    </div>
    )
}

export default LoadingIcon