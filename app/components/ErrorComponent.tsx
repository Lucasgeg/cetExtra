import { Link } from "react-router-dom";
import logo from "~/assets/cetExtraIcon.png";

const ErrorComponent = ({ error }: { error: Error }) => {
  return (
    <div>
      <div className="Logo">
        <Link to={"/"}>
          <img src={logo} alt="logo cetExtra" />
        </Link>
      </div>
      <h1>cet Extra Désatrophique!</h1>
      <p>
        Il semblerait que nous ayons eu une petite erreur... <br />
        Si le problème persiste n'hésite pas à
        <a href="mailto:lucas.gegot.pro@gmail.com"> nous contacter</a>
      </p>
      <p>En nous adressant ce message:</p>
      <p>{error.name}</p>
      <p>{error.message}</p>
    </div>
  );
};

export default ErrorComponent;
