export function Configuration() {
  const contractAddress = "0x9db5c748dded6de41fc028131def1fa613ce4d9c";
  const publicKey =
    "0x04125d119281c56781ec193b5868ec6df1ad270215e9d0a154ff7a15380d21170b350c09b060dec8356c952aee05f329a348144d2c03c37ff76a283c2689d8d9db";
  const privateKey =
    "c9aadf17ad429b64f83546c751e59e22400038a2d0ec341901fbe7ab446a8615";
  const userB = "0x5559Bc8e5eea2f9a9A66B79ae8e52B428abae553";
  const networkProvider = "http://localhost:7545";
  return(
  {
    contractAddress, 
    privateKey,
    networkProvider,
  }
);
}
