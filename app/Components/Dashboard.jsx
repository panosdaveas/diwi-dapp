import {
    MoonIcon,
    Square3Stack3DIcon,
} from "@heroicons/react/24/outline";
import {
    SunIcon,
} from "@heroicons/react/24/solid";
import {
    Card,
    Drawer,
    IconButton,
    Navbar
} from "@material-tailwind/react";
import { useEffect, useState } from "react";

import { CardLeftSteps } from "./cardLeft";
import { CardRightSteps } from "./cardRight";
import { DefaultTable } from "./contractTable";
import { StepperWithContent } from "./horizontalTimeline";
import { SidebarContent } from "./sidebarContent";
import { Skeleton } from "./skeleton";
import { ConnectWalletButton } from "./walletButton";

const DashboardLayout = ({ children }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('darkMode') === 'true'
        }
        return false;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, []);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode);
        document.body.classList.toggle("dark");
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-200">
            <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-6 py-2 lg:px-6 bg-background-light dark:bg-background-dark border-t-0 border-r-0 border-l-0 border-b-1 border-border-light dark:border-border-dark shadow-none transition-colors duration-200">
                <div className="flex items-center justify-between text-text-light dark:text-text-dark">
                    <div className="flex items-center gap-4">
                        {isMobile && (
                            <IconButton
                                variant="text"
                                className="text-text-light dark:text-text-dark"
                                onClick={() => setIsDrawerOpen(true)}
                            >
                                <Square3Stack3DIcon className="h-6 w-6" />
                            </IconButton>
                        )}
                        <img
                            className="relative dark:invert transition-all duration-200 pl-1"
                            src="/Diwi-logo.svg"
                            alt="Diwi Logo"
                            width="80px"
                            priority="true"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <a href="https://github.com/panosdaveas/DiWi-DApp.git"
                                aria-label="Diwi on GitHub"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                <svg
                                    className="bg-background-light dark:bg-background-dark dark:fill-primary-light"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z">
                                    </path>
                                </svg>
                            </a>
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 focus:outline-none "
                            >
                                {isDarkMode ? (
                                    <SunIcon className="w-6 h-6 dark:text-text-dark" />
                                ) : (
                                    <MoonIcon className="w-6 h-6 text-text-light dark:text-text-dark" />
                                )}
                            </button>
                            <div className="ml-4">
                                {!isMobile && <ConnectWalletButton />}
                            </div>
                        </div>
                    </div>
                </div>
            </Navbar>

            {/* Main Content Area */}
            <div className="flex h-[calc(100vh-64px)]">
                {/* Sidebar - Hidden on mobile */}
                {!isMobile && (
                    <aside className="w-64 flex-shrink-0 border-r border-border-light dark:border-border-dark transition-colors duration-200">
                        <SidebarContent />
                    </aside>
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-auto bg-background-light dark:bg-background-dark transition-colors duration-200">
                    <div className="container mx-auto">
                        {children}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="col-span-full" >
                                <div className="p-4">
                                    <DefaultTable />
                                </div>
                            </div>
                            <div className="col-span-full px-6">
                                <StepperWithContent />
                            </div>
                            <div className="col-span-full grid md:grid-cols-2 gap-6">
                                <CardLeftSteps />
                                <CardRightSteps />
                            </div>
                            <Card className="col-span-1 md:col-span-2 lg:col-span-3 p-6 overflow-hidden border-b border-t border-border-light dark:border-border-dark shadow-none">
                                <Skeleton />
                                {/* Add performance overview content here */}
                            </Card>
                            <div className="col-span-1 space-y-6">
                                <div className="p-6 border-b border-r border-t border-border-light dark:border-border-dark">
                                    <Skeleton />
                                </div>
                                <Card className="p-6">
                                    <Skeleton />
                                </Card>
                            </div>
                            {/* Your grid content */}
                        </div>
                    </div>
                </main>
            </div>

            {/* Mobile Drawer */}
            {isMobile && (
                <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}
                    className="bg-background-light dark:bg-background-dark">
                    <div className="mb-2 flex items-center justify-between p-4 ">
                        {/* <Typography variant="h5" color="blue-gray">
              Material Tailwind
            </Typography> */}
                        <IconButton
                            variant="text"
                            color="blue-gray"
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke={!isDarkMode ? "currentColor" : "white"}
                                className="h-5 w-5 "
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </IconButton>
                    </div>
                    <SidebarContent />
                </Drawer>
            )}
        </div>
    );
};

export { DashboardLayout };
