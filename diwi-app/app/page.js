"use client";

import "./globals.css";
// import { SidebarWithContentSeparator } from "@/app/Components/sidebar";
import { MessageCardLeft } from "@/app/Components/cardLeft";
import { MessageCardRight } from "@/app/Components/cardRight";
// import { StepperWithContent } from "./Components/horizontalTimeline"; 

import DashboardLayout from './Components/DashboardLayout';
import { Timeline } from "@material-tailwind/react";
import { ActivitiesTimeline } from "./Components/timeline";
import { StepperWithContent } from "./Components/horizontalTimeline";

// const digitalWill = () => {
//   return (
//     <div className="flex h-screen bg-gray-100">
//       <aside className="bg-white shadow-md">
//         <SidebarWithContentSeparator />
//       </aside>
//       <main className="flex min-h-screen flex-col items-center p-12 gap-12">
//         {/* <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex"> */}
//           <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
//             Get started with&nbsp;
//             <code className="font-mono font-bold">Digital Will</code>
//           </p>
//         {/* </div> */}
//         <div className="mb-32 grid gap-6 text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-2 lg:text-left">
//           <MessageCardLeft />
//           <MessageCardRight />
//         </div>
//         <StepperWithContent />
//       </main>
//     </div>
//   );
// };

// export default digitalWill;

// app/components/DashboardLayout.js

// app/page.js

export default function Home() {
  return (
    <DashboardLayout>
        {/* <StepperWithContent/>
        <MessageCardLeft />
        <MessageCardRight /> */}
    </DashboardLayout>
  );
}