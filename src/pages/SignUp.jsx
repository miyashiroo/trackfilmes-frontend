// src/pages/SignUp.jsx
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

const SignUp = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Schema de validação Yup
  const SignupSchema = Yup.object().shape({
    name: Yup.string().required("Nome é obrigatório"),
    email: Yup.string().email("Email inválido").required("Email é obrigatório"),
    password: Yup.string()
      .min(8, "Senha deve ter no mínimo 8 caracteres")
      .matches(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
        "Senha deve conter pelo menos um número e um caractere especial"
      )
      .required("Senha é obrigatória"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Senhas não conferem")
      .required("Confirmação de senha é obrigatória"),
    birthDate: Yup.date()
      .nullable()
      .transform((curr, orig) => (orig === "" ? null : curr)),
    termsAccepted: Yup.boolean()
      .required("Você precisa aceitar os termos")
      .oneOf([true], "Você precisa aceitar os termos"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setError("");
      // Remover confirmPassword e termsAccepted antes de enviar para o servidor
      const { confirmPassword, termsAccepted, ...userData } = values;

      // Formatação dos dados conforme esperado pelo backend
      const userToRegister = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        // Apenas inclui birthDate se tiver um valor
        ...(userData.birthDate ? { birthDate: userData.birthDate } : {}),
      };

      console.log(
        "Formato dos dados enviados para registro:",
        JSON.stringify(userToRegister, null, 2)
      );

      await registerUser(userToRegister);
      setSuccess(true);
      resetForm();
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Erro ao registrar:", err);

      // Exibir informações detalhadas sobre o erro
      if (err.response) {
        console.error("Resposta de erro do servidor:", {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data,
        });

        // Mensagem de erro para o usuário
        const errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          `Erro (${err.response.status}): ${err.response.statusText}`;
        setError(errorMessage);
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
        <div className="col-lg-6 col-md-8">
          <div className="auth-card card fade-in">
            <div className="auth-header">
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
              <h2 className="auth-title">Crie sua conta</h2>
              <p className="text-white-50 mb-0">
                Acompanhe seus filmes favoritos
              </p>
            </div>

            <div className="auth-body">
              {success ? (
                <div className="alert alert-success text-center py-4">
                  <i className="bi bi-check-circle-fill fs-1 d-block mb-3"></i>
                  <h4>Conta criada com sucesso!</h4>
                  <p>Redirecionando para o login...</p>
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Redirecionando...</span>
                  </div>
                </div>
              ) : (
                <Formik
                  initialValues={{
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    birthDate: "",
                    termsAccepted: false,
                  }}
                  validationSchema={SignupSchema}
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

                      <div className="row">
                        <div className="col-12 mb-3">
                          <label htmlFor="name" className="form-label">
                            <i className="bi bi-person me-2"></i>Nome completo
                          </label>
                          <Field
                            type="text"
                            name="name"
                            className={`form-control ${
                              touched.name && errors.name ? "is-invalid" : ""
                            }`}
                          />
                          <ErrorMessage
                            name="name"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>

                        <div className="col-12 mb-3">
                          <label htmlFor="email" className="form-label">
                            <i className="bi bi-envelope me-2"></i>Email
                          </label>
                          <Field
                            type="email"
                            name="email"
                            className={`form-control ${
                              touched.email && errors.email ? "is-invalid" : ""
                            }`}
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label htmlFor="password" className="form-label">
                            <i className="bi bi-lock me-2"></i>Senha
                          </label>
                          <Field
                            type="password"
                            name="password"
                            className={`form-control ${
                              touched.password && errors.password
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="invalid-feedback"
                          />
                          <small className="form-text text-muted">
                            <i className="bi bi-info-circle me-1"></i>
                            Mínimo 8 caracteres, incluindo números e símbolos.
                          </small>
                        </div>

                        <div className="col-md-6 mb-3">
                          <label
                            htmlFor="confirmPassword"
                            className="form-label"
                          >
                            <i className="bi bi-shield-lock me-2"></i>Confirmar
                            Senha
                          </label>
                          <Field
                            type="password"
                            name="confirmPassword"
                            className={`form-control ${
                              touched.confirmPassword && errors.confirmPassword
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                          <ErrorMessage
                            name="confirmPassword"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>

                        <div className="col-12 mb-4">
                          <label htmlFor="birthDate" className="form-label">
                            <i className="bi bi-calendar me-2"></i>Data de
                            Nascimento (opcional)
                          </label>
                          <Field
                            type="date"
                            name="birthDate"
                            className={`form-control ${
                              touched.birthDate && errors.birthDate
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                          <ErrorMessage
                            name="birthDate"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>

                        <div className="col-12 mb-4">
                          <div className="form-check">
                            <Field
                              type="checkbox"
                              name="termsAccepted"
                              className={`form-check-input ${
                                touched.termsAccepted && errors.termsAccepted
                                  ? "is-invalid"
                                  : ""
                              }`}
                              id="termsAccepted"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="termsAccepted"
                            >
                              Concordo com os{" "}
                              <Link to="/terms" className="text-primary">
                                Termos de Uso
                              </Link>{" "}
                              e{" "}
                              <Link to="/privacy" className="text-primary">
                                Política de Privacidade
                              </Link>
                            </label>
                            <ErrorMessage
                              name="termsAccepted"
                              component="div"
                              className="invalid-feedback"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="d-grid gap-2 mt-4">
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
                              Criando conta...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-person-plus me-2"></i>
                              Criar Conta
                            </>
                          )}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              )}
            </div>

            <div className="auth-footer">
              <p className="mb-0">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-primary fw-bold">
                  Faça login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
