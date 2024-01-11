pragma solidity 0.5.9;

/*
The function of this smart-contract is to act as a reserve and distributor of timelocked giveaways.
It interacts with a timelocking contract (timelockContract) that has a function that looks like this:

// This function timelocks the tokens.
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
*/

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

interface ITimelockContract {
    function markTokensForGiveaway(address[] calldata receivers, uint256[] calldata amounts) external;
    function getBalance(address _addr) external view returns (uint256);
}

interface ITokenContract {
    function approveAndCall(address spender, uint tokens, bytes calldata data) external returns (bool);
}

contract GiveawayReserve {
    address owner;
    ITimelockContract timelockContract;
    ITokenContract tokenContract;
    uint256 public currentTier;
    uint256 public totalTimelocked;
    mapping(uint256 => uint256) public tiers;
    mapping(address => uint256) public giveawayEligible;
    mapping(address => uint256) public userTimelocked;
    mapping(address => bool) public hasClaimed;
    mapping(address => mapping(uint256 => uint256)) private userTimelockedInTier;
    mapping(uint256 => uint256) private totalTimelockedInTier;



modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

constructor(address _timelockContractAddress, address _tokenContractAddress) public {
        owner = msg.sender;
        timelockContract = ITimelockContract(_timelockContractAddress);
        tokenContract = ITokenContract(_tokenContractAddress);
        setupTiers();
    }

function setupTiers() internal {
        // Setup tier amounts
    tiers[1] = 150000 * 10**8;
    tiers[2] = 75000 * 10**8;
    tiers[3] = 37500 * 10**8;
    tiers[4] = 18750 * 10**8;
    tiers[5] = 9375 * 10**8;
    tiers[6] = 4687.5 * 10**8;
    tiers[7] = 2343.75 * 10**8;
    tiers[8] = 1171.875 * 10**8;
    tiers[9] = 585.9375 * 10**8;
    tiers[10] = 585.9375 * 10**8;
        currentTier = 1;
        
    }

function calculateEligibleAmount(address user) internal view returns (uint256) {
    uint256 eligibleAmount = 0;

    for (uint256 tier = 1; tier <= currentTier; tier++) {
        uint256 userAmountInTier = userTimelockedInTier[user][tier];
        uint256 giveawayRatio = getGiveawayRatioForTier(tier);

        eligibleAmount += userAmountInTier * giveawayRatio / 10**8;
    }

    return eligibleAmount;
}

function getGiveawayRatioForTier(uint256 tier) internal pure returns (uint256) {

    if (tier == 1) return 1 * 10**8; // 1:1 ratio
    if (tier == 2) return 0.5 * 10**8; // 0.5:1 ratio
    if (tier == 3) return 0.25 * 10**8; // 0.25:1 ratio
    if (tier == 4) return 0.125 * 10**8; // 0.125:1 ratio
    if (tier == 5) return 0.0625 * 10**8; // 0.0625:1 ratio
    if (tier == 6) return 0.03125 * 10**8; // 0.03125:1 ratio
    if (tier == 7) return 0.015625 * 10**8; // 0.015625:1 ratio
    if (tier == 8) return 0.0078125 * 10**8; // 0.0078125:1 ratio
    if (tier == 9) return 0.00390625 * 10**8; // 0.00390625:1 ratio
    if (tier == 10) return 0.00390625 * 10**8; // 0.00390625:1 ratio
    return 0; // Default case for an undefined tier

}

function updateEligibility(address user, uint256 amountTimelocked) external {
    require(msg.sender == address(timelockContract), "Not timelock contract");
    uint256 remainingAmount = amountTimelocked;

    while (remainingAmount > 0 && currentTier <= 10) {
        uint256 availableInCurrentTier = tiers[currentTier] - totalTimelockedInTier[currentTier];

        uint256 amountToAllocate = (remainingAmount <= availableInCurrentTier) ? remainingAmount : availableInCurrentTier;

        userTimelockedInTier[user][currentTier] += amountToAllocate;
        totalTimelockedInTier[currentTier] += amountToAllocate;
        remainingAmount -= amountToAllocate;

        // Check if it's time to move to the next tier
        if (totalTimelockedInTier[currentTier] >= tiers[currentTier] && currentTier < 10) {
            currentTier++;
        }
    }

    require(remainingAmount == 0, "Failed to allocate all timelocked tokens");
}

function advanceTier() internal {
        if (totalTimelocked >= tiers[currentTier] && currentTier < 10) {
            currentTier++;
        }
    }

function claimGiveawayReserve() public {
    uint256 eligibleAmount = calculateEligibleAmount(msg.sender);
    require(eligibleAmount > 0, "Not eligible for giveaway");

    address[] memory receivers = new address[](1);
    uint256[] memory amounts = new uint256[](1);

    receivers[0] = msg.sender;
    amounts[0] = eligibleAmount;

    timelockContract.markTokensForGiveaway(receivers, amounts);

    // Deduct from each tier's timelocked amount based on the claimed eligible amount
    for (uint256 tier = 1; tier <= currentTier && eligibleAmount > 0; tier++) {
        uint256 userAmountInTier = userTimelockedInTier[msg.sender][tier];
        uint256 giveawayRatio = getGiveawayRatioForTier(tier);
        uint256 claimableAmount = userAmountInTier * giveawayRatio / 10**8;

        if (eligibleAmount <= claimableAmount) {
            uint256 deductedAmountInTier = (eligibleAmount * 10**8) / giveawayRatio;
            userTimelockedInTier[msg.sender][tier] -= deductedAmountInTier;
            break; // All eligible amount has been deducted
        } else {
            // Deduct the entire amount in this tier and reduce the eligible amount accordingly
            eligibleAmount -= claimableAmount;
            userTimelockedInTier[msg.sender][tier] = 0;
        }
    }
}


function checkEligible(address user) public view returns (uint256) {
    if (hasClaimed[user]) {
        return 0;
    }
    return calculateEligibleAmount(user);
}

function ownerTimelockTokens(uint256 tokens, bytes memory data) public onlyOwner {
        require(tokenContract.approveAndCall(address(timelockContract), tokens, data), "Token approval failed");
    }
}
