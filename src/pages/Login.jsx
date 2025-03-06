import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../contexts/authContext";

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  // Schema de validação Yup
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Email inválido").required("Email é obrigatório"),
    password: Yup.string().required("Senha é obrigatória"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError("");
      console.log("Tentando login com:", values.email);

      const response = await loginUser(values);
      console.log("Resposta de login:", response);

      // Atualiza o contexto de autenticação
      login(response.user);

      // Redireciona para a página inicial após login
      navigate("/dashboard");
    } catch (err) {
      console.error("Erro no login:", err);

      // Tratamento detalhado de erros
      if (err.response) {
        console.error("Resposta de erro do servidor:", {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data,
        });

        // Mensagens específicas baseadas no status
        if (err.response.status === 401) {
          setError("Email ou senha incorretos.");
        } else {
          setError(
            err.response.data?.message ||
              err.response.data?.error ||
              "Erro ao fazer login."
          );
        }
      } else if (err.request) {
        console.error("Nenhuma resposta recebida:", err.request);
        setError(
          "Não foi possível conectar ao servidor. Verifique sua conexão."
        );
      } else {
        console.error("Erro de configuração:", err.message);
        setError(`Erro inesperado: ${err.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-8">
          <div className="card shadow-sm fade-in">
            <div className="card-header text-center bg-primary py-4">
              <div className="text-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="48"
                  height="48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19.82 2H4.18C2.97 2 2 2.97 2 4.18v15.64C2 21.03 2.97 22 4.18 22h15.64c1.21 0 2.18-.97 2.18-2.18V4.18C22 2.97 21.03 2 19.82 2z" />
                  <path d="M7 2v20" />
                  <path d="M17 2v20" />
                  <path d="M2 12h20" />
                  <path d="M2 7h5" />
                  <path d="M2 17h5" />
                  <path d="M17 17h5" />
                  <path d="M17 7h5" />
                </svg>
              </div>
              <h2 className="text-white mb-1">Bem-vindo de volta!</h2>
              <p className="text-white-50 mb-0">
                Entre para acompanhar seus filmes
              </p>
            </div>

            <div className="card-body bg-white p-4">
              <Formik
                initialValues={{
                  email: "",
                  password: "",
                }}
                validationSchema={LoginSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, touched, errors }) => (
                  <Form>
                    {error && (
                      <div className="alert alert-danger mb-4">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        {error}
                      </div>
                    )}

                    <div className="mb-4">
                      <label htmlFor="email" className="form-label">
                        <i className="bi bi-envelope me-2"></i>Email
                      </label>
                      <Field
                        type="email"
                        name="email"
                        className={`form-control form-control-lg ${
                          touched.email && errors.email ? "is-invalid" : ""
                        }`}
                        placeholder="seu@email.com"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="password" className="form-label">
                        <i className="bi bi-lock me-2"></i>Senha
                      </label>
                      <Field
                        type="password"
                        name="password"
                        className={`form-control form-control-lg ${
                          touched.password && errors.password
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="••••••••"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>

                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="rememberMe"
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Lembrar-me
                      </label>
                    </div>

                    <div className="d-grid gap-2 mt-4 mb-4">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Entrando...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-box-arrow-in-right me-2"></i>
                            Entrar
                          </>
                        )}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>

            <div className="card-footer bg-light py-3 text-center">
              <p className="mb-0">
                Não tem uma conta?{" "}
                <Link to="/signup" className="text-primary fw-bold">
                  Cadastre-se
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
