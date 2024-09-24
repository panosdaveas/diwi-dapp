"use client";

import "./globals.css";
import Image from "next/image";
import Web3 from "web3";
import { SidebarWithContentSeparator } from "@/Components/sidebar";
import { MessageDialog } from "@/Components/messageDialog";
import { MessageCardLeft } from "@/Components/cardLeft";
import { MessageCardRight } from "@/Components/cardRight";
import { CustomContext } from "./Context/context";

const digitalWill = () => {

  let web3;
  const connectWalletHandler = async () => {
    //alert("connect wallet");
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      console.log("MetaMask is installed!");
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        const balance = await web3.eth.getBalance(account);
        const balanceinEth = web3.utils.fromWei(balance, 'ether');
        console.log('Connected account:', account);
        console.log('Balance:', balanceinEth);
        console.log('Balance:', balance);
      } catch (err) {
        console.log(err.message);
      }
    } else {
      alert("MetaMask not installed!");
      console.log("MetaMask not installed!");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="bg-white shadow-md">
      <SidebarWithContentSeparator />
      </aside>

    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    {/* <main className="flex-1 p-6 overflow-auto"> */}
    {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> */}
      {/* <DrawerWithNavigation /> */}
      {/* <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started with&nbsp;
          <code className="font-mono font-bold">Digital Will</code>
       </p>
     </div> */}
     <div className="mb-32 grid gap-6 text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-2 lg:text-left">
     <MessageCardLeft/>
     <MessageCardRight/>
     </div>



      {/* <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/DiWi-2.svg"
          alt="Diwi Logo"
          width={180}
          height={37}
          priority
        />
      </div> */}

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <MessageDialog />

        <a
          href="#"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800 hover:dark:bg-opacity-30"
          target="_blank"
          rel="noopener noreferrer"
         >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Learn{" "}
             <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
           <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Learn how to use DiWi in an interactive course!
          </p>
        </a>
        <a
          //href="#"
          onClick={connectWalletHandler}
          // onClick={ () => connectWalletHandler(web3)}
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          //target="_blank"
          //rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Connect{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Connect your wallet-to-go with the digital will service.
          </p>
         </a>

        <a
          href="#"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
         >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Deploy{" "}
             <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance`}>
            Instantly deploy your content to a smart contract in ETH chain.
          </p>
        </a>
      </div>
     </main>
  </div>
  );
};

export default digitalWill;
