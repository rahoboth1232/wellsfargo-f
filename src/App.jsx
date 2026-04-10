import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChasePage from "./pages/Home";
import TransferForm from "./pages/Transfer";
import ChaseDashboard from "./pages/Dashboard";
import HomeLayout from "./layouts/HomeLayout";
import MainLayout from "./layouts/MainLayout";
import ChaseProfileSection from "./pages/Profile";
import ChaseStatements from "./pages/Statement&documents";
import ProtectedLayout from "./layouts/ProtectedLayout";
import TransferActivity from "./pages/TranferActivity";
import CDAccountDashboard from "./pages/CdAccounts";
import { Toaster } from "react-hot-toast";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";



export default function App() {

  
  return (
    <BrowserRouter>
    <Toaster 
     position="top-center"
  toastOptions={{
    style: {
      marginTop: "40vh",
      textAlign: "center",
      padding: "16px 24px",
      fontSize: "14px",
      animationDuration:"1000ms"
    },
  }} reverseOrder={false} />
      <Routes>

        <Route path="/" element={
          <HomeLayout>
          <ChasePage/>
          </HomeLayout>
      } />

      
        <Route path="/signin" element={
          <SignIn/>
        } />

        <Route path="signup" element={<SignUp/>}/>

<Route element={<ProtectedLayout />}>


        <Route path="/dashboard" element={
          <MainLayout>
          <ChaseDashboard/>
          </MainLayout>
          
        } />

        <Route path="/Profile" element={
          <MainLayout>

          <ChaseProfileSection/>
          </MainLayout>
          
        } />
        <Route path="/statement&documents" element={
          <MainLayout>

          <ChaseStatements/>
          </MainLayout>
          
        } />


        <Route path="/transfer" element={
          <MainLayout>

          <TransferForm/>
          </MainLayout>
          
        } />
        <Route path="/transferactivity" element={
          <MainLayout>

          <TransferActivity/>
          </MainLayout>
          
        } />
        <Route path="/cdAccounts" element={
          <MainLayout>

          <CDAccountDashboard/>
          </MainLayout>
          
        } />
        

        </Route>
      </Routes>
    </BrowserRouter>
  );
}