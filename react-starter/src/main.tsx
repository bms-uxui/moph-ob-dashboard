import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Theme as RadixTheme } from "@radix-ui/themes";

import Dashboard from "./pages/Dashboard.tsx";
import LaborRoom from "./pages/LaborRoom.tsx";
import PatientDetail from "./pages/PatientDetail.tsx";
import ANCHistory from "./pages/ANCHistory.tsx";
import HighRisk from "./pages/HighRisk.tsx";
import HospitalSummary from "./pages/HospitalSummary.tsx";

import "./index.css";
import "@radix-ui/themes/styles.css";

// MUI theme — Maternal Pink
const muiTheme = createTheme({
  typography: {
    fontFamily:
      '"Google Sans", "Google Sans Text", "Google Sans Display", "Noto Sans Thai", system-ui, sans-serif',
  },
  palette: {
    primary: { main: "#E91E63" },
    secondary: { main: "#F06292" },
    error: { main: "#C62828" },
    warning: { main: "#E65100" },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <HeroUIProvider>
        <ThemeProvider theme={muiTheme}>
          <RadixTheme accentColor="pink" radius="medium">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/labor-room" element={<LaborRoom />} />
              <Route path="/patient/:cid" element={<PatientDetail />} />
              <Route path="/anc/:cid" element={<ANCHistory />} />
              <Route path="/high-risk" element={<HighRisk />} />
              <Route path="/hospital-summary" element={<HospitalSummary />} />
            </Routes>
          </RadixTheme>
        </ThemeProvider>
      </HeroUIProvider>
    </HashRouter>
  </StrictMode>
);
