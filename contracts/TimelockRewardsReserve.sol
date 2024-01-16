pragma solidity 0.5.9;

/*
The function of this smart-contract is to act as a Timelock Rewards reserve/treasury and distributor of timelocked tokens to users to timelock their BSOV Tokens.
It interacts with a timelocking contract (timelockContract).
https://SovCube.com

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
    uint256 public totalEligibleAmount;
    uint256 public totalClaimed;
    mapping(uint256 => uint256) public tiers;
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
 
function setupTiers() internal {
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

    if (tier == 1) return 1 * 10**8;
    if (tier == 2) return 0.5 * 10**8;
    if (tier == 3) return 0.25 * 10**8;
    if (tier == 4) return 0.125 * 10**8;
    if (tier == 5) return 0.0625 * 10**8;
    if (tier == 6) return 0.03125 * 10**8;
    if (tier == 7) return 0.015625 * 10**8;
    if (tier == 8) return 0.0078125 * 10**8;
    if (tier == 9) return 0.00390625 * 10**8;
    if (tier == 10) return 0.00390625 * 10**8;
    return 0;

}

function updateEligibility(address user, uint256 amountTimelocked) external {
    require(msg.sender == address(timelockContract), "Not timelock contract");
    require(amountTimelocked <= 14500000000000, "Cannot timelock more than 145,000 tokens at once");
    totalTimelocked = totalTimelocked.add(amountTimelocked);
    uint256 newEligibleAmount = 0;
    uint256 nextTierThreshold = currentTier.mul(15000000000000);
    if (totalTimelocked < nextTierThreshold || currentTier == 10) {
        uint256 giveawayRatio = getGiveawayRatioForTier(currentTier);
        newEligibleAmount = amountTimelocked.mul(giveawayRatio).div(10**8);
        totalTimelockedInTier[currentTier] = totalTimelockedInTier[currentTier].add(amountTimelocked);
        userTimelockedInTier[user][currentTier] = userTimelockedInTier[user][currentTier].add(amountTimelocked);
    } else {
        uint256 amountInCurrentTier = nextTierThreshold.sub(totalTimelocked.sub(amountTimelocked));
        uint256 giveawayRatioCurrent = getGiveawayRatioForTier(currentTier);
        newEligibleAmount = amountInCurrentTier.mul(giveawayRatioCurrent).div(10**8);
        totalTimelockedInTier[currentTier] = totalTimelockedInTier[currentTier].add(amountInCurrentTier);
        userTimelockedInTier[user][currentTier] = userTimelockedInTier[user][currentTier].add(amountInCurrentTier);
        currentTier++;
        uint256 amountInNextTier = amountTimelocked.sub(amountInCurrentTier);
        uint256 giveawayRatioNext = getGiveawayRatioForTier(currentTier);
        newEligibleAmount = newEligibleAmount.add(amountInNextTier.mul(giveawayRatioNext).div(10**8));
        totalTimelockedInTier[currentTier] = totalTimelockedInTier[currentTier].add(amountInNextTier);
        userTimelockedInTier[user][currentTier] = userTimelockedInTier[user][currentTier].add(amountInNextTier);
    }
    eligibleAmount[user] = eligibleAmount[user].add(newEligibleAmount);
    totalEligibleAmount = totalEligibleAmount.add(newEligibleAmount);
}

function claimGiveawayReserve() public {
    require(eligibleAmount[msg.sender] > 0, "You have no eligible tokens for Timelock Rewards. You have to timelock tokens first.");

    uint256 amount = eligibleAmount[msg.sender];
    eligibleAmount[msg.sender] = 0;
    totalClaimed = totalClaimed.add(amount);

    address[] memory receivers = new address[](1);
    uint256[] memory amounts = new uint256[](1);
    receivers[0] = msg.sender;
    amounts[0] = amount;
    timelockContract.markTokensForGiveaway(receivers, amounts);
}


function ownerTimelockTokens(uint256 tokens, bytes memory data) public onlyOwner {
        require(tokenContract.approveAndCall(address(timelockContract), tokens, data), "Token approval failed");
    }
}
