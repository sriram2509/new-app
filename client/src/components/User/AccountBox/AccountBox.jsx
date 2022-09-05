import styled from "styled-components";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoginForm from "./loginForm";
import SignUpForm from "./signUpForm";
import { clearErrors } from "../../../state/actions/userActions";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export const BoxContainer = styled.div`
  width: 290px;
  min-height: 550px;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 0 3px rgba(15, 15, 15, 0.28);
  position: relative;
  overflow: hidden;
`;

export const TopContainer = styled.div`
  width: 100%;
  height: 240px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 1.8em;
  padding-bottom: 4em;
`;

export const BackDrop = styled(motion.div)`
  width: 160%;
  height: 550px;
  display: flex;
  flex-direction: column;
  border-radius: 50%;
  position: absolute;
  top: -290px;
  left: -70px;
  transform: rotate(60deg);
  background: rgb(6, 42, 30);
  background: linear-gradient(
    65deg,
    rgba(6, 42, 30, 1) 20%,
    rgba(28, 168, 196, 1) 100%
  );
`;

export const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  z-index: 10;
`;

export const HeaderText = styled.h2`
  font-size: 2em;
  font-weight: 600;
  color: rgb(255, 255, 255);
  line-height: 1.24;
  margin: 0;
`;

export const SmallText = styled.h5`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.7em;
  font-weight: 400;
  margin-top: 0.5em;
  letter-spacing: 0.02em;
  word-spacing: 0.1em;
`;

export const InnerContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 1.8em;
`;

// variant for the back drop
const BackDropVariants = {
  expanded: {
    width: "233%",
    height: "1000px",
    borderRradius: "20%",
    transform: "rotate(60deg)",
  },
  collapsed: {
    width: "160%",
    height: "550px",
    borderRradius: "50%",
    transform: "rotate(60deg)",
  },
};

const expandingTransition = {
  type: "spring",
  duration: 2,
  stiffness: 30,
};

const AccountBox = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const location = useLocation();

  const { error, isAuthenticated } = useSelector((state) => state.user);

  const [isExpanded, setIsExpanded] = useState(false);
  const [active, setActive] = useState("login");

  const playTransitionAnimation = () => {
    setIsExpanded(true);
    setTimeout(() => {
      setIsExpanded(false);
    }, expandingTransition.duration * 1000 - 1000);
  };

  const switchToSignUp = () => {
    playTransitionAnimation();
    setTimeout(() => {
      setActive("signup");
    }, 1150);
  };

  const switchToLogIn = () => {
    playTransitionAnimation();
    setTimeout(() => {
      setActive("login");
    }, 1150);
  };

  // redirect function used especially for the check out page
  const redirectFunc = location.search
    ? location.search.split("=")[1]
    : "account";

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      navigate(`/${redirectFunc}`);
    }
  }, [dispatch, alert, error, isAuthenticated, navigate, redirectFunc]);

  return (
    <Container>
      <BoxContainer>
        <TopContainer>
          <BackDrop
            initial={false}
            animate={isExpanded ? "expanded" : "collapsed"}
            variants={BackDropVariants}
            transition={expandingTransition}
          />
          {active === "login" ? (
            <HeaderContainer>
              <HeaderText>Welcome</HeaderText>
              <HeaderText>Back</HeaderText>
              <SmallText>Please login to continue!</SmallText>
            </HeaderContainer>
          ) : (
            <HeaderContainer>
              <HeaderText>Create</HeaderText>
              <HeaderText>Account</HeaderText>
              <SmallText>Please signup to continue!</SmallText>
            </HeaderContainer>
          )}
        </TopContainer>
        <InnerContainer>
          {active === "login" && (
            <LoginForm switchToSignUp={switchToSignUp} dispatch={dispatch} />
          )}
          {active === "signup" && (
            <SignUpForm switchToLogIn={switchToLogIn} dispatch={dispatch} />
          )}
        </InnerContainer>
      </BoxContainer>
    </Container>
  );
};

export default AccountBox;
