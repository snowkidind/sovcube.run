
pragma solidity 0.5.9;

// Sovcube TimeLock, & Slow Release & Timelocked Giveaway Contract
// 
//
// DO NOT SEND TOKENS DIRECTLY TO THIS CONTRACT!!!
// THEY WILL BE LOST FOREVER!!!
// YOU HAVE TO MAKE A CALL TO THE CONTRACT TO BE ABLE TO DEPOSIT & WITHDRAW!!!
//
// This contract locks deposited BSOV Tokens for 1000 days from the day the contract is deployed. Tokens can be added at any TimeLock
// within that period without resetting the timer.
// Once the users have timelocked their tokens, they are able to giveaway timelocked tokens to anyone,
// they can even batch several addresses into one giveaway-transaction.
//
// After the desired date is reached, users can withdraw tokens with a rate limit to prevent all holders
// from withdrawing and selling at the same time. The limit is 100 BSoV per week per user once the 1000 days is hit.

library SafeMath {
    function add(uint a, uint b) internal pure returns(uint c) {
        c = a + b;
        require(c >= a);
    }
    function sub(uint a, uint b) internal pure returns(uint c) {
        require(b <= a);
        c = a - b;
    }
    function mul(uint a, uint b) internal pure returns(uint c) {
        c = a * b;
        require(a == 0 || c / a == b);
    }
    function div(uint a, uint b) internal pure returns(uint c) {
        require(b > 0);
        c = a / b;
    }
}

contract ERC20Interface {
    function totalSupply() public view returns(uint);
    function balanceOf(address tokenOwner) public view returns(uint balance);
    function allowance(address tokenOwner, address spender) public view returns(uint remaining);
    function transfer(address to, uint tokens) public returns(bool success);
    function approve(address spender, uint tokens) public returns(bool success);
    function transferFrom(address from, address to, uint tokens) public returns(bool success);
    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}
interface IGiveawayReserve {
    function updateEligibility(address user, uint256 amount) external;
}


contract LockMyBSOV {
    address owner;
    using SafeMath for uint;

    struct Giveaway {
    uint256 amount;
    uint256 newLockTime;
    address from;
    bool isPending;
}

    address constant tokenContract = 0x09136144d9E442314051735DCa3Ead1a705f1546; // The BSOV Token contract

    address public giveawayReserveAddress;
    IGiveawayReserve giveawayReserve;


    uint constant PRECISION = 100000000;
    uint constant timeUntilUnlocked = 1000 days;            // All tokens locked for 1000 days after contract creation.
    uint constant maxWithdrawalAmount = 100 * PRECISION;  // Max withdrawal of 100 tokens per week per user once 1000 days is hit.
    uint constant timeBetweenWithdrawals = 7 days;
    uint unfreezeDate;

    mapping (address => uint) giveawayBalance;
    mapping (address => uint) giveawayLockExpiration;
	mapping (address => uint) balance;
	mapping (address => uint) lastWithdrawal;
    mapping (address => uint) lastGiveawayWithdrawal;
    mapping(address => Giveaway) public pendingGiveaways;

    event GiveawayMarked(address indexed from, address indexed to, uint256 amount);
    event TokensClaimed(address indexed to, uint256 amount);

    event TokensFrozen (
        address indexed addr,
        uint256 amt,
        uint256 time
	);

    event TokensUnfrozen (
        address indexed addr,
        uint256 amt,
        uint256 time
	);

    constructor() public {
        owner = msg.sender;
        unfreezeDate = now + timeUntilUnlocked;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

function setGiveawayReserveAddress(address _address) public onlyOwner {
    giveawayReserveAddress = _address;
    giveawayReserve = IGiveawayReserve(giveawayReserveAddress);
}


function markTokensForGiveaway(address[] memory _receivers, uint[] memory _amounts) public {
    require(_receivers.length == _amounts.length, "Mismatched array lengths");

    uint totalAmount = 0;
    for (uint i = 0; i < _amounts.length; i++) {
        totalAmount += _amounts[i];
    }

    require(balance[msg.sender] >= totalAmount, "Insufficient balance for giveaway");

    for (uint i = 0; i < _receivers.length; i++) {
        address receiver = _receivers[i];
        uint amount = _amounts[i];
        
        // Update the giveaway balance and lock time without checking for existing pending giveaways
        pendingGiveaways[receiver].amount += amount;
        pendingGiveaways[receiver].from = msg.sender;
        pendingGiveaways[receiver].isPending = true;

        emit GiveawayMarked(msg.sender, receiver, amount);
    }

    balance[msg.sender] -= totalAmount;
}






function claimGiveawayTokens() public {
    require(pendingGiveaways[msg.sender].isPending, "No giveaway tokens to claim");

    Giveaway memory giveaway = pendingGiveaways[msg.sender];
    giveawayBalance[msg.sender] += giveaway.amount;  // Add tokens to recipient's balance
    giveawayLockExpiration[msg.sender] = now + 1000 days;  // Set new lock expiration
    delete pendingGiveaways[msg.sender];  // Clear the pending giveaway

    emit TokensClaimed(msg.sender, giveaway.amount);
}


function withdraw(uint _amount, bool fromGiveaway) public {
    require(_amount > 0, "Withdraw amount must be greater than zero");

    uint256 balanceToCheck = fromGiveaway ? giveawayBalance[msg.sender] : balance[msg.sender];
    uint256 lockExpiration = fromGiveaway ? giveawayLockExpiration[msg.sender] : unfreezeDate;

    require(now >= lockExpiration, "Tokens are locked!");
    require(balanceToCheck >= _amount, "Insufficient timelocked balance for withdrawal");
    
    require(now >= lastWithdrawal[msg.sender] + timeBetweenWithdrawals, "Trying to withdraw too frequently!");

    require(_amount <= maxWithdrawalAmount, "Exceeds max withdrawal amount");

    if (fromGiveaway) {
        giveawayBalance[msg.sender] -= _amount;
        lastGiveawayWithdrawal[msg.sender] = now;
    } else {
        balance[msg.sender] -= _amount;
        lastWithdrawal[msg.sender] = now;
    }

    require(ERC20Interface(tokenContract).transfer(msg.sender, _amount), "Withdrawal: Transfer failed");
    emit TokensUnfrozen(msg.sender, _amount, now);
}




    function getBalance(address _addr) public view returns (uint256 _balance) {
        return balance[_addr];
    }


function getLastGiveawayWithdrawal(address _addr) public view returns (uint256 _lastWithdrawalTime) {
    return lastGiveawayWithdrawal[_addr];
}



    function getLastWithdrawal(address _addr) public view returns (uint256 _lastWithdrawal) {
        return lastWithdrawal[_addr];
    }
   
    function getTimeLeft() public view returns (uint256 _timeLeft) {
        require(unfreezeDate > now, "Tokens are unlocked and ready for withdrawal");
        return unfreezeDate - now;
    } 

    function getGiveawayTimeLeft(address _addr) public view returns (uint256 _timeLeft) {
    if (giveawayLockExpiration[_addr] <= now) {
        return 0; // Tokens are already unlocked
    } else {
        return giveawayLockExpiration[_addr] - now;
    }
}

function getUnclaimedGiveawayBalance(address _user) public view returns (uint256) {
    if(pendingGiveaways[_user].isPending) {
        return pendingGiveaways[_user].amount;
    } else {
        return 0;
    }
}


function getGiveawayBalance(address _addr) public view returns (uint256 _balance) {
    return giveawayBalance[_addr];
}

    
    function receiveApproval(address _sender, uint256 _value, address _tokenContract, bytes memory _extraData) public {
        require(_tokenContract == tokenContract, "Can only deposit BSOV into this contract!");
        require(_value > 100, "Value must be greater than 100 Mundos");
        require(ERC20Interface(tokenContract).transferFrom(_sender, address(this), _value), "Timelocking transaction failed");

        uint _adjustedValue = _value.mul(99).div(100);
        balance[_sender] += _adjustedValue;
        emit TokensFrozen(_sender, _adjustedValue, now);
        if (_sender != giveawayReserveAddress) {
        if (giveawayReserveAddress != address(0)) {
        giveawayReserve.updateEligibility(_sender, _adjustedValue);
     }
  }
    }
    
}
