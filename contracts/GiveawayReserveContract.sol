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
    using SafeMath for uint256;
    address owner;
    ITimelockContract timelockContract;
    ITokenContract tokenContract;
    uint256 public currentTier;
    uint256 public totalTimelocked;
    uint256 public totalEligibleAmount; // Tracks total tokens eligible for giveaway
    mapping(uint256 => uint256) public tiers;
    mapping(address => uint256) public giveawayEligible;
    mapping(address => uint256) public userTimelocked;
    mapping(address => bool) public hasClaimed;
    mapping(address => mapping(uint256 => uint256)) private userTimelockedInTier;
    mapping(uint256 => uint256) private totalTimelockedInTier;

    mapping(address => uint256) public eligibleAmount;


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

// These amounts for each tier is the total amount of tokens that can be designated to the totalEligibleAmount variable. 
function setupTiers() internal {
        // Setup tier amounts
    tiers[1] = 15000000000000;
    tiers[2] = 7500000000000;
    tiers[3] = 3750000000000;
    tiers[4] = 1875000000000;
    tiers[5] = 937500000000;
    tiers[6] = 468750000000;
    tiers[7] = 234375000000;
    tiers[8] = 117187500000;
    tiers[9] = 58593750000;
    tiers[10] = 58593750000;
        currentTier = 1;
        
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

    // Update the total timelocked amount
    totalTimelocked = totalTimelocked.add(amountTimelocked);
    uint256 newEligibleAmount = 0;

    // Calculate the threshold for the next tier
    uint256 nextTierThreshold = currentTier.mul(15000000000000); // 150,000 in base units

    // Check if the totalTimelocked amount is still within the current tier
    if (totalTimelocked < nextTierThreshold || currentTier == 10) {
        // Entire amount is in the current tier
        uint256 giveawayRatio = getGiveawayRatioForTier(currentTier);
        newEligibleAmount = amountTimelocked.mul(giveawayRatio).div(10**8);
        totalTimelockedInTier[currentTier] = totalTimelockedInTier[currentTier].add(amountTimelocked);
        userTimelockedInTier[user][currentTier] = userTimelockedInTier[user][currentTier].add(amountTimelocked);
    } else {
        // Part of the amount causes a transition to the next tier

        // Amount in the current tier
        uint256 amountInCurrentTier = nextTierThreshold.sub(totalTimelocked.sub(amountTimelocked));
        uint256 giveawayRatioCurrent = getGiveawayRatioForTier(currentTier);
        newEligibleAmount = amountInCurrentTier.mul(giveawayRatioCurrent).div(10**8);
        totalTimelockedInTier[currentTier] = totalTimelockedInTier[currentTier].add(amountInCurrentTier);
        userTimelockedInTier[user][currentTier] = userTimelockedInTier[user][currentTier].add(amountInCurrentTier);

        // Update the tier
        currentTier++;

        // Amount in the next tier
        uint256 amountInNextTier = amountTimelocked.sub(amountInCurrentTier);
        uint256 giveawayRatioNext = getGiveawayRatioForTier(currentTier);
        newEligibleAmount = newEligibleAmount.add(amountInNextTier.mul(giveawayRatioNext).div(10**8));
        totalTimelockedInTier[currentTier] = totalTimelockedInTier[currentTier].add(amountInNextTier);
        userTimelockedInTier[user][currentTier] = userTimelockedInTier[user][currentTier].add(amountInNextTier);
    }

    // Update the eligible amount for the user
    eligibleAmount[user] = eligibleAmount[user].add(newEligibleAmount);
}




function claimGiveawayReserve() public {
    require(eligibleAmount[msg.sender] > 0, "Not eligible for giveaway");

    uint256 amount = eligibleAmount[msg.sender];
    eligibleAmount[msg.sender] = 0; // Reset the eligible amount

    // Prepare the data for the markTokensForGiveaway function
    address[] memory receivers = new address[](1);
    uint256[] memory amounts = new uint256[](1);
    receivers[0] = msg.sender;
    amounts[0] = amount;

    // Call the markTokensForGiveaway function on the timelockContract
    timelockContract.markTokensForGiveaway(receivers, amounts);
}




function checkEligible(address user) public view returns (uint256) {
    if (hasClaimed[user]) {
        return 0;
    }
    return eligibleAmount[user];
}

function ownerTimelockTokens(uint256 tokens, bytes memory data) public onlyOwner {
        require(tokenContract.approveAndCall(address(timelockContract), tokens, data), "Token approval failed");
    }
}
