"use client";

import "./globals.css";

// import DashboardLayout from "./Components/Dashboard";

import dynamic from "next/dynamic";

const DashboardLayout = dynamic(() => import("./Components/Dashboard"), {
  ssr: false,
});

export default function Home() {

  return (
    <DashboardLayout></DashboardLayout>
  );

}
