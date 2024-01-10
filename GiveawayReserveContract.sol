pragma solidity ^0.5.9;

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

 function calculateEligibleAmount(uint256 timelockedAmount) internal view returns (uint256) {
    if (currentTier > 10) {
        return 0; // No giveaway tokens available after tier 10
    }

    uint256 giveawayRatio;
    // Define the giveaway ratio based on the currentTier
    // The ratio is the amount of giveaway tokens per timelocked token
    // For Tier 1, it is 1:1 (150000 BSOV for 150000 timelocked BSOV)
    if (currentTier == 1) {
        giveawayRatio = 1 * 10**8; // 1:1 ratio
    } else if (currentTier == 2) {
        giveawayRatio = 0.5 * 10**8; // 0.5:1 ratio
    } else if (currentTier == 3) {
        giveawayRatio = 0.25 * 10**8; // 0.25:1 ratio
    } else if (currentTier == 4) {
        giveawayRatio = 0.125 * 10**8; // 0.125:1 ratio
    } else if (currentTier == 5) {
        giveawayRatio = 0.0625 * 10**8; // 0.0625:1 ratio
    } else if (currentTier == 6) {
        giveawayRatio = 0.03125 * 10**8; // 0.03125:1 ratio
    } else if (currentTier == 7) {
        giveawayRatio = 0.015625 * 10**8; // 0.015625:1 ratio
    } else if (currentTier == 8) {
        giveawayRatio = 0.0078125 * 10**8; // 0.0078125:1 ratio
    } else if (currentTier == 9) {
        giveawayRatio = 0.00390625 * 10**8; // 0.00390625:1 ratio
    } else if (currentTier == 10) {
        giveawayRatio = 0.00390625 * 10**8; // 0.00390625:1 ratio (same as Tier 9)
    }

    // Calculate the eligible amount based on the timelocked amount and the ratio
    uint256 eligibleAmount = timelockedAmount * giveawayRatio / 10**8; // Adjust ratio to smallest unit

    return eligibleAmount;
}



    function updateEligibility(address user, uint256 amountTimelocked) external {
        require(msg.sender == address(timelockContract), "Not timelock contract");
        totalTimelocked += amountTimelocked;
        userTimelocked[user] += amountTimelocked;
        advanceTier();
    }

    function advanceTier() internal {
        if (totalTimelocked >= tiers[currentTier] && currentTier < 10) {
            currentTier++;
        }
    }

function claimGiveawayReserve() public {
    uint256 eligibleAmount = calculateEligibleAmount(userTimelocked[msg.sender]);
    require(eligibleAmount > 0, "Not eligible for giveaway");

    address[] memory receivers = new address[](1);
    uint256[] memory amounts = new uint256[](1);

    receivers[0] = msg.sender;
    amounts[0] = eligibleAmount;

    timelockContract.markTokensForGiveaway(receivers, amounts);

    // Update the user's claimed amount and reduce their eligibility
    userTimelocked[msg.sender] -= eligibleAmount;
}



    function checkEligible(address user) public view returns (uint256) {
        if (hasClaimed[user]) {
            return 0;
        }
        return calculateEligibleAmount(userTimelocked[user]);
    }


 function ownerTimelockTokens(uint256 tokens, bytes memory data) public onlyOwner {
        require(tokenContract.approveAndCall(address(timelockContract), tokens, data), "Token approval failed");
    }
}
