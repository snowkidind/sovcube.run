pragma solidity 0.5.9;

interface TimelockContract {
    function withdraw(uint _amount, bool fromIncomingTokensAccount) external;
}

contract GovernanceTreasury {
    struct Proposal {
        string proposalHeading;
        string proposalText;
        uint amountOfBSOV;
        address proposalAddress;
        bool isTimelocked;
        bool activated;
        bool passed;
        uint yesVotes;
        uint noVotes;
        uint creationTime;
    }

    struct Voter {
        bool hasVoted;
        bool isTopVoter;
    }

    address public timelockContractAddress;
    address public bsovTokenAddress;
    address payable public owner;
    uint public constant PROPOSAL_FEE = 100 * 1e18; // 100 BSOV
    uint public constant TOTAL_TOP_VOTERS = 300;
    uint public constant TOP_50_VOTES = 3;
    uint public constant TOP_51_TO_100_VOTES = 2;
    uint public constant TOP_101_TO_300_VOTES = 1;
    uint public constant VOTING_PERIOD = 100 days;
    uint public proposalCount;
    mapping(address => Voter) public voters;
    mapping(uint => Proposal) public proposals;

    event ProposalCreated(uint indexed proposalId, string proposalHeading, address indexed proposalAddress);
    event ProposalActivated(uint indexed proposalId);
    event Voted(uint indexed proposalId, address indexed voter, bool vote, uint yesVotes, uint noVotes);
    event ProposalPassed(uint indexed proposalId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyTopVoter() {
        require(voters[msg.sender].isTopVoter, "Only top voters can call this function");
        _;
    }

  constructor(address _timelockContractAddress, address _bsovTokenAddress) public {
        owner = msg.sender;
        timelockContractAddress = _timelockContractAddress;
        bsovTokenAddress = _bsovTokenAddress;
    }

    function createProposal(string memory _proposalHeading, string memory _proposalText, uint _amountOfBSOV, address _proposalAddress, bool _isTimelocked) public payable {
        require(msg.value >= PROPOSAL_FEE, "Insufficient fee");
        require(_amountOfBSOV > 0, "Amount must be greater than 0");

        proposalCount++;
        proposals[proposalCount] = Proposal({
            proposalHeading: _proposalHeading,
            proposalText: _proposalText,
            amountOfBSOV: _amountOfBSOV,
            proposalAddress: _proposalAddress,
            isTimelocked: _isTimelocked,
            activated: false,
            passed: false,
            yesVotes: 0,
            noVotes: 0,
            creationTime: now
        });

        emit ProposalCreated(proposalCount, _proposalHeading, _proposalAddress);
    }

    function activateProposal(uint _proposalId) public {
        require(!proposals[_proposalId].activated, "Proposal already activated");
        require(msg.sender == proposals[_proposalId].proposalAddress, "Only proposal owner can activate");

        proposals[_proposalId].activated = true;

        emit ProposalActivated(_proposalId);
    }

    function vote(uint _proposalId, bool _vote) public {
        require(proposals[_proposalId].activated, "Proposal not activated");
        require(now < proposals[_proposalId].creationTime + VOTING_PERIOD, "Voting period ended");
        require(!voters[msg.sender].hasVoted, "You already voted");

        voters[msg.sender].hasVoted = true;

        if (voters[msg.sender].isTopVoter) {
            if (voters[msg.sender].isTopVoter) {
                proposals[_proposalId].yesVotes += TOP_50_VOTES;
            } else if (voters[msg.sender].isTopVoter) {
                proposals[_proposalId].yesVotes += TOP_51_TO_100_VOTES;
            } else {
                proposals[_proposalId].yesVotes += TOP_101_TO_300_VOTES;
            }
        } else {
            proposals[_proposalId].yesVotes += 1;
        }

        if (_vote) {
            proposals[_proposalId].yesVotes++;
        } else {
            proposals[_proposalId].noVotes++;
        }

        emit Voted(_proposalId, msg.sender, _vote, proposals[_proposalId].yesVotes, proposals[_proposalId].noVotes);
    }

    function withdrawLockedTokens(uint _proposalId) public {
        require(proposals[_proposalId].activated, "Proposal not activated");
        require(proposals[_proposalId].passed, "Proposal not passed");
        require(msg.sender == proposals[_proposalId].proposalAddress, "Only proposal winner can withdraw tokens");

        TimelockContract timelockContract = TimelockContract(timelockContractAddress);
        timelockContract.withdraw(10000000000, true); // Withdraw 100 BSOV from timelock

        proposals[_proposalId].passed = false; // Reset proposal status
    }

    function setTopVoters(address[] memory _topVoters) public onlyOwner {
        require(_topVoters.length <= TOTAL_TOP_VOTERS, "Too many top voters");

        for (uint i = 0; i < _topVoters.length; i++) {
            voters[_topVoters[i]].isTopVoter = true;
        }
    }

    function removeTopVoter(address _voter) public onlyOwner {
        voters[_voter].isTopVoter = false;
    }

    function finalizeProposal(uint _proposalId) public {
        require(proposals[_proposalId].activated, "Proposal not activated");
        require(now >= proposals[_proposalId].creationTime + VOTING_PERIOD, "Voting period not ended");

        if (proposals[_proposalId].yesVotes >= 224 && proposals[_proposalId].yesVotes > proposals[_proposalId].noVotes * 16 / 10) {
            proposals[_proposalId].passed = true;
            emit ProposalPassed(_proposalId);
        }
    }

    function transferOwnership(address payable _newOwner) public onlyOwner {
        owner = _newOwner;
    }

    function transferEther(uint _amount) public onlyOwner {
        owner.transfer(_amount);
    }

    function transferAnyERC20Token(address _tokenAddress, address _to, uint _amount) public onlyOwner {
        ERC20Interface(_tokenAddress).transfer(_to, _amount);
    }

    function getProposal(uint _proposalId) public view returns (
        string memory proposalHeading,
        string memory proposalText,
        uint amountOfBSOV,
        address proposalAddress,
        bool isTimelocked,
        bool activated,
        bool passed,
        uint yesVotes,
        uint noVotes,
        uint creationTime
    ) {
        Proposal memory proposal = proposals[_proposalId];
        return (
            proposal.proposalHeading,
            proposal.proposalText,
            proposal.amountOfBSOV,
            proposal.proposalAddress,
            proposal.isTimelocked,
            proposal.activated,
            proposal.passed,
            proposal.yesVotes,
            proposal.noVotes,
            proposal.creationTime
        );
    }
}

interface ERC20Interface {
    function transfer(address to, uint tokens) external returns (bool success);
}
