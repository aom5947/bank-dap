// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Bank
/// @notice Smart Contract ระบบธนาคาร ตามโจทย์ที่อาจารย์กำหนด (อ้างอิงสำหรับดูโค้ด)
/// @dev ชื่อฟังก์ชัน checkBlance สะกดตามต้นฉบับของโจทย์
contract Bank {
    mapping(address => uint256) private _balances;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

    /// @notice ฝาก ETH เข้าสัญญา
    function deposit() public payable {
        require(msg.value > 0, "Amount must be greater than 0");
        _balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    /// @notice ถอน ETH ตามจำนวนที่ระบุ
    function withdraw(uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        require(_balances[msg.sender] >= amount, "Insufficient balance");

        _balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdraw(msg.sender, amount);
    }

    /// @notice ตรวจสอบยอดเงินฝากของผู้ที่เรียกฟังก์ชัน
    function checkBlance() public view returns (uint256) {
        return _balances[msg.sender];
    }
}
