import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import {
  updateUserProfile,
  updatePassword,
  deleteAccount,
} from "../services/authService";

const ProfileEdit = () => {
  const { currentUser, updateUserData, logout } = useAuth();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  // Schema de validação para o perfil
  const ProfileSchema = Yup.object().shape({
    name: Yup.string().required("Nome é obrigatório"),
    email: Yup.string().email("Email inválido").required("Email é obrigatório"),
    birthDate: Yup.date()
      .nullable()
      .transform((curr, orig) => (orig === "" ? null : curr)),
  });

  // Schema de validação para alteração de senha
  const ChangePasswordSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Senha atual é obrigatória"),
    newPassword: Yup.string()
      .min(8, "Senha deve ter no mínimo 8 caracteres")
      .matches(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
        "Senha deve conter pelo menos um número e um caractere especial"
      )
      .required("Nova senha é obrigatória"),
  });

  // Schema de validação para exclusão de conta
  const DeleteAccountSchema = Yup.object().shape({
    password: Yup.string().required(
      "Senha é obrigatória para confirmar a exclusão da conta"
    ),
  });

  // Função para atualizar o perfil
  const handleProfileUpdate = async (values, { setSubmitting }) => {
    try {
      setError("");
      setSuccess("");

      console.log("Enviando atualização de perfil:", values);
      const response = await updateUserProfile(values);

      // Atualizar o contexto com os novos dados
      updateUserData(response.user);

      setSuccess("Perfil atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);

      if (err.response) {
        // Tratamento de erro específico para email duplicado
        if (err.response.status === 409) {
          setError("Este email já está sendo usado por outra conta.");
        } else {
          setError(
            err.response.data?.message ||
              "Erro ao atualizar perfil. Tente novamente."
          );
        }
      } else if (err.request) {
        setError(
          "Não foi possível conectar ao servidor. Verifique sua conexão."
        );
      } else {
        setError(`Erro inesperado: ${err.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Função para atualizar senha
  const handlePasswordChange = async (values, { setSubmitting }) => {
    try {
      setError("");
      setSuccess("");

      await updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      setSuccess("Senha atualizada com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar senha:", err);

      if (err.response && err.response.status === 401) {
        setError("Senha atual incorreta.");
      } else {
        setError("Erro ao atualizar senha. Tente novamente.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Função para excluir a conta
  const handleDeleteAccount = async (values, { setSubmitting }) => {
    try {
      setError("");
      setSuccess("");

      // Confirmação adicional
      if (
        !window.confirm(
          "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita."
        )
      ) {
        return;
      }

      await deleteAccount(values.password);

      // Após excluir a conta, realizar logout e redirecionar para a página inicial
      logout();
      navigate("/login");
      alert("Sua conta foi excluída com sucesso.");
    } catch (err) {
      console.error("Erro ao excluir conta:", err);

      if (err.response && err.response.status === 401) {
        setError("Senha incorreta. Não foi possível excluir a conta.");
      } else {
        setError("Erro ao excluir conta. Tente novamente.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Formatação da data para o formato YYYY-MM-DD para exibição no input
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card shadow-sm">
            <div className="card-header bg-primary py-3">
              <h3 className="text-white mb-0">Editar Perfil</h3>
            </div>
            <div className="card-body bg-white">
              <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "profile" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("profile")}
                  >
                    <i className="bi bi-person me-2"></i>
                    Informações Pessoais
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "password" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("password")}
                  >
                    <i className="bi bi-key me-2"></i>
                    Alterar Senha
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "delete" ? "active" : ""
                    } text-danger`}
                    onClick={() => setActiveTab("delete")}
                  >
                    <i className="bi bi-trash me-2"></i>
                    Excluir Conta
                  </button>
                </li>
              </ul>

              {/* Mensagens de sucesso e erro */}
              {success && (
                <div className="alert alert-success mb-4">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  {success}
                </div>
              )}
              {error && (
                <div className="alert alert-danger mb-4">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}

              {/* Aba de edição de perfil */}
              {activeTab === "profile" && (
                <Formik
                  initialValues={{
                    name: currentUser?.name || "",
                    email: currentUser?.email || "",
                    birthDate: formatDateForInput(currentUser?.birthDate),
                  }}
                  validationSchema={ProfileSchema}
                  onSubmit={handleProfileUpdate}
                >
                  {({ isSubmitting, touched, errors }) => (
                    <Form>
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                          <i className="bi bi-person me-2"></i>Nome
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

                      <div className="mb-3">
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

                      <div className="d-grid gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Salvando...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-check-circle me-2"></i>
                              Salvar Alterações
                            </>
                          )}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              )}

              {/* Aba de alteração de senha */}
              {activeTab === "password" && (
                <Formik
                  initialValues={{
                    currentPassword: "",
                    newPassword: "",
                  }}
                  validationSchema={ChangePasswordSchema}
                  onSubmit={handlePasswordChange}
                >
                  {({ isSubmitting, touched, errors }) => (
                    <Form>
                      <div className="mb-3">
                        <label htmlFor="currentPassword" className="form-label">
                          <i className="bi bi-lock me-2"></i>Senha Atual
                        </label>
                        <Field
                          type="password"
                          name="currentPassword"
                          className={`form-control ${
                            touched.currentPassword && errors.currentPassword
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        <ErrorMessage
                          name="currentPassword"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">
                          <i className="bi bi-lock-fill me-2"></i>Nova Senha
                        </label>
                        <Field
                          type="password"
                          name="newPassword"
                          className={`form-control ${
                            touched.newPassword && errors.newPassword
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        <ErrorMessage
                          name="newPassword"
                          component="div"
                          className="invalid-feedback"
                        />
                        <div className="form-text">
                          <i className="bi bi-info-circle me-1"></i>A senha deve
                          ter no mínimo 8 caracteres, incluindo números e
                          caracteres especiais.
                        </div>
                      </div>

                      <div className="d-grid gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Alterando...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-key-fill me-2"></i>
                              Alterar Senha
                            </>
                          )}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              )}

              {/* Aba de exclusão de conta */}
              {activeTab === "delete" && (
                <div>
                  <div className="alert alert-danger mb-4">
                    <h5 className="alert-heading">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      Atenção! Esta ação não pode ser desfeita.
                    </h5>
                    <p>
                      Ao excluir sua conta, todos os seus dados serão
                      permanentemente removidos do sistema, incluindo suas
                      informações pessoais e listas de filmes.
                    </p>
                  </div>

                  <Formik
                    initialValues={{ password: "" }}
                    validationSchema={DeleteAccountSchema}
                    onSubmit={handleDeleteAccount}
                  >
                    {({ isSubmitting, touched, errors }) => (
                      <Form>
                        <div className="mb-3">
                          <label htmlFor="password" className="form-label">
                            <i className="bi bi-shield-lock me-2"></i>
                            Confirme sua senha
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
                          <div className="form-text">
                            <i className="bi bi-info-circle me-1"></i>
                            Por segurança, digite sua senha para confirmar a
                            exclusão da conta.
                          </div>
                        </div>

                        <div className="d-grid gap-2">
                          <button
                            type="submit"
                            className="btn btn-danger"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Processando...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-trash-fill me-2"></i>
                                Excluir Minha Conta Permanentemente
                              </>
                            )}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
