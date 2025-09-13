import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import PatientRegister from "@/pages/patient-register";
import PatientLogin from "@/pages/patient-login";
import PatientDashboard from "@/pages/patient-dashboard";
import HospitalLogin from "@/pages/hospital-login";
import HospitalDashboard from "@/pages/hospital-dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/patient/register" component={PatientRegister} />
      <Route path="/patient/login" component={PatientLogin} />
      <Route path="/patient/dashboard/:id" component={PatientDashboard} />
      <Route path="/hospital/login" component={HospitalLogin} />
      <Route path="/hospital/dashboard" component={HospitalDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="securehealth-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
