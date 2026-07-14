"use client";

import { useEffect, useState } from "react";
import { CallBackProps, STATUS, Step } from "react-joyride";
import dynamic from "next/dynamic";

const Joyride = dynamic(
  () => import("react-joyride").then((mod) => mod.Joyride),
  { ssr: false }
);
import { usePathname } from "next/navigation";

export default function DemoTour() {
  const [run, setRun] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Only run the tour on the main dashboard page after login
    if (pathname === "/" && !localStorage.getItem("quantify_tour_completed")) {
      // Small delay so animations finish
      setTimeout(() => {
        setRun(true);
      }, 1000);
    }
  }, [pathname]);

  const steps: Step[] = [
    {
      target: "body",
      content: "Welcome to Quantify! 🚀 Let's take a quick tour of your AI calling platform.",
      placement: "center",
      disableBeacon: true,
    },
    {
      target: ".tour-stats",
      content: "Here you can monitor your active calls and overall success rate in real-time. Notice the live indicator!",
      placement: "bottom",
    },
    {
      target: ".tour-activity",
      content: "Watch as inbound and outbound calls are completed. The AI automatically generates summaries and extracts intents.",
      placement: "top",
    },
    {
      target: ".tour-quick-actions",
      content: "You can schedule a new campaign or start a live demo call right from the dashboard.",
      placement: "left",
    },
    {
      target: ".tour-sidebar",
      content: "Use the sidebar to configure your AI Agents, view detailed Call Logs, and access the Live Panel. Try clicking 'Live Panel' after this tour to test an agent!",
      placement: "right",
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    
    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem("quantify_tour_completed", "true");
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      showSkipButton
      showProgress
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#2563eb', // blue-600
          textColor: '#f5f5f5',
          backgroundColor: '#171717', // neutral-900
          arrowColor: '#171717',
          overlayColor: 'rgba(0, 0, 0, 0.7)',
        },
        buttonNext: {
          backgroundColor: '#2563eb',
          borderRadius: '6px',
        },
        buttonBack: {
          color: '#a3a3a3',
        },
        buttonSkip: {
          color: '#a3a3a3',
        },
      }}
    />
  );
}
