import { useForm } from "react-hook-form";
import { register } from "~/utils/auth.server";

const LoginForm = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmitHandler = async (data) => {
    const response = await fetch("/test/submit", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      console.log("error");
    } else {
      console.log("Mail envoyé");
      reset();
    }
  };

  return (
    <form
      className="w-1/2 mx-auto bg-purple-900 rounded-md flex flex-col text-center p-5"
      onSubmit={handleSubmit(onSubmitHandler)}
    >
      {/* first Name */}
      <label htmlFor="firstName" className="label">
        Prénom
      </label>{" "}
      <br />
      <input
        type="text"
        placeholder="Prénom"
        className="input"
        {...register("firstName", { required: true })}
      />{" "}
      <br />
      {/* Last Name */}
      <label htmlFor="lastName" className="label">
        Nom
      </label>{" "}
      <br />
      <input
        type="text"
        placeholder="Nom"
        className="input"
        {...register("lastName", { required: true })}
      />{" "}
      <br />
      {/* Email */}
      <label htmlFor="email" className="label">
        Email
      </label>{" "}
      <br />
      <input
        type="email"
        placeholder="Email"
        className="input"
        {...register("email", { required: true })}
      />{" "}
      <br />
      {/* password */}
      <label htmlFor="password" className="label">
        Password
      </label>{" "}
      <br />
      <input
        type="password"
        placeholder=""
        className="input"
        {...register("password", { required: true })}
      />{" "}
      <br />
      {/* Repeat passowrd */}
      <label htmlFor="repeatPassword" className="label">
        Repeat Password
      </label>{" "}
      <br />
      <input
        type="Password"
        placeholder=""
        className="input"
        {...register("repeatPassword", { required: true })}
      />{" "}
      <br />
      {/* Birthday */}
      <label htmlFor="birthday" className="label">
        Date de naissance
      </label>{" "}
      <br />
      <input type="date" placeholder="" className="input" /> <br />
      <label htmlFor="birthPlace">Lieu de naissance</label>
      <input
        type="text"
        placeholder="Wakanda City"
        className="input"
        {...register("birthPlace", { required: true })}
      />
      <div className="text-right">
        <button type="submit" className="mt-3 p-2 bg-slate-400 rounded-lg w-16">
          Valider
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
