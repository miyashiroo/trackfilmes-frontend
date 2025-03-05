// src/pages/Login.jsx
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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Login</h3>
            </div>
            <div className="card-body">
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
                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email
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
                        Senha
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
                    </div>

                    <div className="d-grid gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Entrando..." : "Entrar"}
                      </button>
                    </div>

                    <div className="mt-3 text-center">
                      Não tem uma conta? <Link to="/signup">Cadastre-se</Link>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
