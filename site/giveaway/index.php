<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SovCube Timelock Rewards</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="/styles-fonts.css">
<link rel="icon" href="/images/favicon-logo.png" type="image/x-icon">
<script src="https://cdn.jsdelivr.net/npm/web3/dist/web3.min.js"></script>
</head>

<body>
    <?php include $_SERVER['DOCUMENT_ROOT'] . '/menu.php'; ?>

    <div class="body-container">
        <div class="blurred-background"></div>

        <div class="text-container">
            <h1 class="brand-name">SovCube Timelock Rewards</h1>
            <h2>Be Early To Maximize Your Rewards</h2>

            <p>Welcome to SovCube Timelock Rewards! We're inviting the community to participate in a unique event where early users have the chance to double their BSOV token holdings. Here's how you can be a part of it:</p>


            <div class="button-container"> 
                <p>Time-lock your BSOV Tokens to be eligible for additional rewards. Click the button below to access the web3 dApp and start timelocking your BSOV Tokens!</p>
	<button onclick="window.location.href='/dapp/index.php'" class="launch-button">Receive Timelock Rewards</button>
            </div>
</div>


<div class="body-container">
<div class="text-container">     
	    <h3>Understanding the Reward Tiers</h3>

<div class="giveaway-progress-container">
    <div class="giveaway-progress-bar" id="giveawayProgressBar" data-tooltip="Current Progress: 1,000 / 1,500,000 BSOV">
        <div class="current-progress" style="width: calc(500000 / 1500000 * 100%);"></div>
        <!-- Markers for every 150,000 tokens -->
        <div class="marker" style="left: calc(150000 / 1500000 * 100%);" title="150,000 Tokens"></div>
        <div class="marker" style="left: calc(300000 / 1500000 * 100%);" title="300,000 Tokens"></div>
        <div class="marker" style="left: calc(450000 / 1500000 * 100%);" title="450,000 Tokens"></div>
        <div class="marker" style="left: calc(600000 / 1500000 * 100%);" title="600,000 Tokens"></div>
        <div class="marker" style="left: calc(750000 / 1500000 * 100%);" title="750,000 Tokens"></div>
        <div class="marker" style="left: calc(900000 / 1500000 * 100%);" title="900,000 Tokens"></div>
        <div class="marker" style="left: calc(1050000 / 1500000 * 100%);" title="1,050,000 Tokens"></div>
        <div class="marker" style="left: calc(1200000 / 1500000 * 100%);" title="1,200,000 Tokens"></div>
        <div class="marker" style="left: calc(1350000 / 1500000 * 100%);" title="1,350,000 Tokens"></div>
        <!--<div class="marker" style="left: calc(1500000 / 1500000 * 100%);" title="1,500,000 Tokens"></div>-->
    </div>
</div>

<div id="totalTimelockedDisplayElement">
    <h3>Total Timelocked Tokens by Users:</h3>
    <p id="totalTimelockedAmount">Loading...</p>
</div>

<div id="totalRewardsSentDisplayElement">
    <h3>Total Rewards Sent to Users:</h3>
    <p id="totalRewardsSentAmount">Loading...</p>
</div>

<div id="currentTierDisplay">
    <h3>Current Tier:</h3>
    <p id="currentTier">Loading...</p>
</div>

	    
<p>With this Timelock Reward Tier Schedule, we are distributing <strong>300,000 BSOV tokens</strong> in a structured tier system. Each tier represents a phase in the Timelock Rewards System, and for every 150,000 tokens that are time-locked in total by the community, we progress through these tiers.</p>
<p>The reward for each tier halves compared to the previous one, starting from a generous 150,000 BSOV in the first tier. This structure ensures a fair and rewarding experience for all participants, especially those who join early.</p>

            <div class="giveaway-container">
                <!-- Individual Tier Descriptions -->
                <!-- Repeat for other giveaways -->
                    

<div class="giveaway" id="giveaway1">
    <h2>Reward Tier 1</h2>
    <p>Total Tier Reward: <strong>150,000 BSOV</strong>.<br>Timelocking 1,000 BSOV receives approximately 1,000 BSOV.</p>
</div>
<div class="giveaway" id="giveaway2">
    <h2>Reward Tier 2</h2>
    <p>Total Tier Reward: <strong>75,000 BSOV</strong>.<br>Timelocking 1,000 BSOV receives approximately 500 BSOV.</p>
</div>
<div class="giveaway" id="giveaway3">
    <h2>Reward Tier 3</h2>
    <p>Total Tier Reward: <strong>37,500 BSOV</strong>.<br>Timelocking 1,000 BSOV receives approximately 250 BSOV.</p>
</div>
<div class="giveaway" id="giveaway4">
    <h2>Reward Tier 4</h2>
    <p>Total Tier Reward: <strong>18,750 BSOV</strong>.<br>Timelocking 1,000 BSOV receives approximately 125 BSOV.</p>
</div>
<div class="giveaway" id="giveaway5">
    <h2>Reward Tier 5</h2>
    <p>Total Tier Reward: <strong>9,375 BSOV</strong>.<br>Timelocking 1,000 BSOV receives approximately 62.5 BSOV.</p>
</div>
<div class="giveaway" id="giveaway6">
    <h2>Reward Tier 6</h2>
    <p>Total Tier Reward: <strong>4,687 BSOV</strong>.<br>Timelocking 1,000 BSOV receives approximately 31.25 BSOV.</p>
</div>
<div class="giveaway" id="giveaway7">
    <h2>Reward Tier 7</h2>
    <p>Total Tier Reward: <strong>2,343 BSOV</strong>.<br>Timelocking 1,000 BSOV receives approximately 15.625 BSOV.</p>
</div>
<div class="giveaway" id="giveaway8">
    <h2>Reward Tier 8</h2>
    <p>Total Tier Reward: <strong>1,171 BSOV</strong>.<br>Timelocking 1,000 BSOV receives approximately 7.8125 BSOV.</p>
</div>
<div class="giveaway" id="giveaway9">
    <h2>Reward Tier 9</h2>
    <p>Total Tier Reward: <strong>585 BSOV</strong>.<br>Timelocking 1,000 BSOV receives approximately 3.90625 BSOV.</p>
</div>
<div class="giveaway" id="giveaway10">
    <h2>Reward Tier 10</h2>
    <p>Total Tier Reward: <strong>585 BSOV</strong>.<br>Timelocking 1,000 BSOV receives approximately 3.90625 BSOV.</p>
</div>


            <p>Join the SovCube Timelock Rewards System, lock in your BSOV, and be part of this rewarding journey. The sooner you participate, the higher your potential reward. Let’s time-lock and boost our holdings together!</p>
        </div>
    
</div>

<script src="/giveaway/giveaway-progress.js"></script>
</body>
</html>
