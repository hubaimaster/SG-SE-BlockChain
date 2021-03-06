import Local from "../Local";

// dataTyoe
const transaction = [
  {
    hash: "",
    cont_addr: "",
    receiver: "",
    sent_ammount: 0,
    date: "",
    sender: "",
  },
];

// transaction 정보를 추가한다.
export const add = (item) => {
  const ret_transaction = Local.get("transaction");
  if (ret_transaction) {
    ret_transaction.push(item);
    console.log(ret_transaction);
    Local.set("transaction", ret_transaction);
    return { data: "success", status: true };
  } else {
    return { data: "failed", status: false };
  }
};
export const remove = () => {};

// transaction 리스트를 모두 가져온다.
export const get = () => {
  const response = Local.get("transaction");
  if (response) {
    return { data: response, status: true };
  } else {
    return { data: [], status: false };
  }
};

// contract address를 이용해서 transaction 리스트를 가져온다.
export const getByContractAddr = (cont_addr) => {
  const response = Local.get("transaction");
  if (response) {
    return {
      data: response.filter(
        (transaction) => transaction.cont_addr === cont_addr
      ),
      status: true,
    };
  } else {
    return { data: {}, status: false };
  }
};

export const getByUserContAddr = (user_addr, cont_addr) => {
  const response = Local.get("transaction");
  if (response) {
    return {
      data: response.filter(
        (trans) =>
          trans.cont_addr == cont_addr &&
          (trans.sender == user_addr || trans.receiver == user_addr)
      ),
      status: true,
    };
  } else {
    return { data: {}, status: false };
  }
};
