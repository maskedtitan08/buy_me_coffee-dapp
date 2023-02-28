// contract address  0x5FbDB2315678afecb367f032d93F642f64180aa3



// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract coffee {
    // setting owner to receive payments
    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    // event to emit when someone tippedd you coffee
    event NewMemo(
        address indexed from,
        string name,
        uint256 timestamp,
        string message
    );

    // create memo
    struct memo {
        address from;
        string name;
        uint256 timestamp;
        string message;
    }

    // keeping track of memos
    memo[] memos;

    function BuyACoffee(string memory _message, string memory _name)public payable
    {
        require(msg.value > 0, "you don't have enough balance");

        // push memo to memos array
        memos.push(memo(msg.sender, _name, block.timestamp, _message));

        // emit memo after it is created
        emit NewMemo(msg.sender, _name, block.timestamp, _message);
    }

    function WithdrawTips() public {
        require(msg.sender==owner , "you can not withdraw tips");
        require(owner.send(address(this).balance));  // send to owner all balance of this contract
    }

    function getMemos() public view returns(memo[] memory){
        return memos;
    }
}
