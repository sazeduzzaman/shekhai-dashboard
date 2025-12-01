import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Form,
  Input,
  FormFeedback,
  Label,
} from "reactstrap";

const Login = () => {
  const navigate = useNavigate();
  document.title = "Login | shekhai";

  const [error, setError] = React.useState("");

  // Check if user is already logged in and token is valid
  useEffect(() => {
    const saved = localStorage.getItem("authUser");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        // Check if token exists and is not expired
        if (!parsed.token || Date.now() > parsed.expiresAt) {
          localStorage.removeItem("authUser");
          navigate("/login");
        } else {
          // Token exists and valid
          navigate("/dashboard");
        }
      } catch (err) {
        // Invalid localStorage data
        localStorage.removeItem("authUser");
        navigate("/login");
      }
    }
  }, [navigate]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Please enter your email"),
      password: Yup.string().required("Please enter your password"),
    }),
    onSubmit: async (values) => {
      setError("");

      try {
        const res = await axios.post(
          "https://shekhai-server.up.railway.app/api/v1/auth/login",
          values
        );

        const { token, user } = res.data;

        if (!token) {
          setError("Login failed. Token not found.");
          return;
        }

        // Store token + user for 2 hours
        const expiresAt = Date.now() + 2 * 60 * 60 * 1000;

        localStorage.setItem(
          "authUser",
          JSON.stringify({ token, user, expiresAt })
        );

        navigate("/dashboard");
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Invalid email or password. Please try again."
        );
      }
    },
  });

  return (
    <div className="account-pages my-5 pt-sm-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="overflow-hidden">
              <CardBody className="pt-0 p-4">
                <h3 className="text-center text-primary mb-4">Login</h3>

                <Form onSubmit={formik.handleSubmit}>
                  {error && <Alert color="danger">{error}</Alert>}

                  <div className="mb-3">
                    <Label className="form-label">Email</Label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Enter email"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      invalid={
                        formik.touched.email && Boolean(formik.errors.email)
                      }
                    />
                    <FormFeedback>{formik.errors.email}</FormFeedback>
                  </div>

                  <div className="mb-3">
                    <Label className="form-label">Password</Label>
                    <Input
                      name="password"
                      type="password"
                      placeholder="Enter password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      invalid={
                        formik.touched.password &&
                        Boolean(formik.errors.password)
                      }
                    />
                    <FormFeedback>{formik.errors.password}</FormFeedback>
                  </div>

                  <div className="form-check mb-3">
                    <Input
                      type="checkbox"
                      className="form-check-input"
                      id="rememberMe"
                    />
                    <Label className="form-check-label" htmlFor="rememberMe">
                      Remember me
                    </Label>
                  </div>

                  <div className="d-grid mb-3">
                    <button className="btn btn-primary" type="submit">
                      Log In
                    </button>
                  </div>

                  <div className="text-center">
                    <Link to="/forgot-password" className="text-muted">
                      Forgot your password?
                    </Link>
                  </div>
                </Form>
              </CardBody>
            </Card>

            <div className="mt-5 text-center">
              <p>
                © {new Date().getFullYear()} shekhai. Crafted with ❤️ by NGen It
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
