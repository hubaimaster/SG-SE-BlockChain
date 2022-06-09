import ethTx from "ethereumjs-tx";
import * as tokenData from "../data/token";
import * as transactionData from "../data/transaction";
import * as userData from "../data/user";
import { ABI } from "../helper/web3Helper";
import TransactionList from "../../component/TransactionList.js";

export const getAll = (web3) => {
  console.log(web3);
};

export const send = async (web3, cont_addr, target_addr, value) => {
  //현재 코드에서는 정수로 인자를 받는다. 이부분 수정시 SendCoinAPI / "SendCointjs" 부분을 수정
  //수정 완료.
  //여기서 고치자
  let convertedValue = value * Math.pow(10, 10);
  //console.log("Converted ", convertedValue );
  var contract = new web3.eth.Contract(ABI, cont_addr);
  var set_contract = contract.methods.transfer(target_addr, convertedValue);

  var set_contract_byte = set_contract.encodeABI();

  //FIND THE CURRENT USER
  const me = userData.getCurrentUser();

  if (!web3.utils.isAddress(target_addr)) {
    return { data: "address가 잘못되었습니다", status: 404 };
  }
  const balance = await contract.methods.balanceOf(target_addr);
  if (balance < convertedValue) {
    return { data: "자산이 부족합니다", status: 400 };
  }

  web3.eth.getTransactionCount(me.data.address, "pending", (err, nonce) => {
    //console.log("MY Address ", me.data.address);
    if (err) {
      return;
    }
    const allTransaction = transactionData.get();
    console.log("Nounce: ", nonce);
    var Raw_Tx = {
      nonce: web3.utils.toHex(nonce ),
      gasPrice: web3.utils.toHex(1000),
      gasLimit: web3.utils.toHex(3000000),
      data: set_contract_byte,
      from: me.data.address,
      to: cont_addr,
    };

    // priv_key 가져와야
    //const me = userData.getCurrentUser();
    const userPrivKey = Buffer.from(me.data.private_key, "hex");
    console.log("My Address ", me.data.address);
    var Signature = new Buffer.from(userPrivKey, "hex");

    var Make_Tx = new ethTx(Raw_Tx);
    Make_Tx.sign(Signature);

    //console.log("DEBUG Make_Tx Done");

    var Serialized_Tx = Make_Tx.serialize();
    var Raw_Tx_Hex = "0x" + Serialized_Tx.toString("hex");

    //console.log("DEBUG Raw_Tx_Hex Done");

    web3.eth.sendSignedTransaction(Raw_Tx_Hex).on("receipt", (receipt) => {
      console.log("receipt : ", receipt, cont_addr);
      transactionData.add({
        hash: receipt.transactionHash,
        cont_addr: cont_addr,
        receiver: target_addr,
        sent_amount: convertedValue,
        date: new Date(),
        sender: me.data.address,
      });
    });
    //console.log("Transaction DATA ", transactionData.getByContractAddr(cont_addr));
    //console.log("EXAMPLE USE OF function");
    //web3.eth.getTransaction("0x96efa7a92bee62d0f553f2510f1e5d87c7b206656a98bef8efce5da72665a1e9").then(console.log);
  });
};
