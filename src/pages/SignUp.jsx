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
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setError("");
      // Remover confirmPassword antes de enviar para o servidor
      const { confirmPassword, ...userData } = values;

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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Criar Conta</h3>
            </div>
            <div className="card-body">
              {success ? (
                <div className="alert alert-success">
                  Conta criada com sucesso! Redirecionando para o login...
                </div>
              ) : (
                <Formik
                  initialValues={{
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    birthDate: "",
                  }}
                  validationSchema={SignupSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, touched, errors }) => (
                    <Form>
                      {error && (
                        <div className="alert alert-danger">{error}</div>
                      )}

                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                          Nome *
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

                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                          Email *
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

                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                          Senha *
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
                          A senha deve ter no mínimo 8 caracteres, incluindo
                          números e caracteres especiais.
                        </small>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">
                          Confirmar Senha *
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

                      <div className="mb-3">
                        <label htmlFor="birthDate" className="form-label">
                          Data de Nascimento (opcional)
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

                      <div className="d-grid gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Criando conta..." : "Criar Conta"}
                        </button>
                      </div>

                      <div className="mt-3 text-center">
                        Já tem uma conta? <Link to="/login">Faça login</Link>
                      </div>
                    </Form>
                  )}
                </Formik>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
