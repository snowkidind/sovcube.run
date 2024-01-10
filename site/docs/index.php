<?php

?>



<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>SovCube</title>
<link rel="stylesheet" href="/docs/styles.css">
<link rel="stylesheet" href="/styles-fonts.css">
<link rel="icon" href="/images/favicon-logo.png" type="image/x-icon">
<script type="text/javascript">
        function showMessage() {
            document.getElementById('message').style.display = 'block';
        }
    </script>
<script src="https://cdn.jsdelivr.net/npm/web3/dist/web3.min.js"></script>

<!--<script src="/dapp/connect.js"> </script>-->


</head>
<body>

<?php include $_SERVER['DOCUMENT_ROOT'] . '/menu.php'; ?>
<!--<?php include $_SERVER['DOCUMENT_ROOT'] . '/connect.php'; ?>-->
<div class="body-container">

<div class="text-container">
    <div class="text-container">
    <h1>SovCube Documentation</h1>

<div class="toc-container">
    <ul class="toc">
        <li><a href="#introduction">Introduction</a></li>
        <li><a href="#getting-started">Getting Started with Metamask, SovCube & BSOV Token</a></li>
        <li><a href="#time-locking">Time-Locking Tokens</a></li>
        <li><a href="#withdrawal">Withdrawal Process</a></li>
        <li><a href="#smart-contract">Smart Contract Details</a>
<ul>
                <li><a href="#contract-1">Contract 1</a></li>
                <li><a href="#contract-2">Contract 2</a></li>
            </ul>
</li>
        <li><a href="#advanced-features">Advanced Features</a></li>
        <li><a href="#faqs">FAQs</a></li>
        <li><a href="#support">Support and Community</a></li>
        <li><a href="#legal">Legal and Compliance</a></li>
    </ul>
</div>
<p style="color:red;">This page is currently under construction. Some of the content has been automatically generated, and is just acting as a placeholder.</p>
    <!-- Introduction -->
    <section id="introduction">
        <h2>Introduction</h2>
        <p>
            SovCube is a platform that provides access to a collection of timelocking contracts, offering a unique approach to token time-locking. This documentation aims to provide a comprehensive understanding of SovCube's functionalities, its integration with the BSOV ecosystem, and how it enhances token value and stability. Whether you're a new user or an experienced one, this guide will assist you in making the most out of SovCube's features.
        </p>
    </section>

    <!-- Getting Started with SovCube -->
    <section id="getting-started">
        <h2>Getting Started with SovCube</h2>
        <p>
            Begin your journey with SovCube by setting up your wallet like Metamask and filling it up with BSOV Tokens. This section will guide you through connecting your digital wallet, navigating the SovCube interface, and understanding the basic functionalities. Learn about the initial steps required to start using SovCube effectively, including securing your wallet and understanding the dashboard layout.
        </p>
	<h3>Setup your Metamask Wallet</h3>
	<p>The current user interface of SovCube is only tested using the <a href="https://metamask.io/download/" target="_blank">Metamask wallet extension</a> on <a href="https://brave.com" target="_blank">Brave Browser</a>, so first you will need to download this software and create a new wallet.</p>
<p>
<div class="responsive-iframe">
<iframe width="560" height="315" src="https://www.youtube.com/embed/YVgfHZMFFFQ?si=jx61uhf4BvfbvnEo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>
</p>
<p>When creating your Metamask wallet, you will receive a freshly generated mnemonic seed phrase. The seed phrase is 12 english words in a specific order. You will need to physically write these words down on a piece of paper or two. YOU HAVE TO KEEP YOUR SEED PHRASE SAFE! NEVER SEND YOUR SEED PHRASE TO ANYONE, AND NEVER KEEP IT STORED ON YOUR COMPUTER OR ONLINE.</p> <p>You can read more about <a href="https://support.metamask.io/hc/en-us/articles/360015489531" target="_blank">Getting Started with Metamask</a></p>
	<h3>Buy or transfer BSOV Tokens to your Metamask Wallet</h3>
	<p>After you have setup your Metamask wallet extension, you will need to get yourself ETH for transaction fees, and BSOV Tokens. You can either buy ETH and BSOV using the Metamask Wallet, or if you have already bought them, you can transfer them from another wallet or cryptocurrency exchange.</p>	
	<h3>How to buy BSOV Tokens</h3>
	<p>First you will need ETH which works as gasoline for the Ethereum Blockchain. With ETH you can send transactions and interact with smart-contracts on Ethereum. BSOV Token is a smart-contract built on Ethereum, so you will need ETH to interact with BSOV Token.</p>
	<p>You can see more info about buying BSOV Token at this page:</p>
	</p><a href="https://bsovtoken.com/trade" target="_blank">BSOV Token - Buy, Sell & Trade</a></p>
	<h3>Getting started with SovCube</h3>
	<p>After you have installed Metamask, created your wallet, acquired ETH and BSOV Tokens, you now have everything you need to interact with SovCube.</p> 
	<p>First you will need to click "Launch dApp" on the SovCube website.</p>
	<p>Then click the blue button called "Connect to Wallet". This will open a window in your Metamask extension, where you will approve connecting your Metamask wallet to the SovCube website.</p>
    </section>

    <!-- Time-Locking Tokens -->
    <section id="time-locking">
        <h2>Time-Locking Tokens</h2>
        <p>
            Time-locking your BSOV tokens is a strategic approach to long-term investment. This section provides detailed instructions on the time-locking process, covering everything from initiating a time-lock to understanding the underlying mechanisms that govern it. Explore various strategies for time-locking and how they align with different investment goals.
        </p>
    </section>

    <!-- Withdrawal Process -->
    <section id="withdrawal">
        <h2>Withdrawal Process</h2>
        <p>
            Understanding the withdrawal process is crucial for accessing your tokens post-time-lock. This guide details the steps to withdraw your tokens, the conditions that apply, and how to navigate any potential challenges. Familiarize yourself with the withdrawal limits and how they are implemented to maintain market stability.
        </p>
    </section>

    <!-- Smart Contract Details -->
    <section id="smart-contract">
        <h2>Smart Contract Details</h2>
        <p>
            Dive into the technical aspects of SovCube with an overview of its smart contracts. This section is designed for users interested in understanding the contract mechanics, featuring explanations of contract functions, security measures, and how to interact with them directly for advanced operations.
        </p>


<section id="contract-1" class="table-section">
    <h2>Contract 1 Details</h2>
    <table class="contract-table">
        <tbody>
            <tr>
                <th>Function</th>
                <td>Timelock & Withdraw BSOV Tokens</td>
            </tr>
            <tr>
                <th>Contract Address</th>
                <td><a href="https://etherscan.io/address/0x19E6BF254aBf5ABC925ad72d32bac44C6c03d3a4" target="_blank">0x19E6BF254aBf5ABC925ad72d32bac44C6c03d3a4</a></td>
            </tr>
            <tr>
                <th>Deploy Date</th>
                <td>2nd of August 2019</td>
            </tr>
            <tr>
                <th>Current Amount</th>
                <td>[web3 call]</td>
            </tr>
            <tr>
                <th>Unlock Date</th>
                <td>29th of January 2020</td>
            </tr>
            <tr>
                <th>Release Rate</th>
                <td>1000 BSOV per week</td>
            </tr>
        </tbody>
    </table>
    </section>

<section id="contract-2" class="table-section">
    <h2>Contract 2 Details</h2>
    <table class="contract-table">
        <tbody>
            <tr>
                <th>Function</th>
                <td>Timelock, Withdraw & Giveaway BSOV Tokens</td>
            </tr>
            <tr>
                <th>Contract Address</th>
                <td><a href="https://etherscan.io/address/0x73C5c8F335abdA336d55b69169F5FFdb9d61550b" target="_blank">0x73C5c8F335abdA336d55b69169F5FFdb9d61550b</a></td>
            </tr>
            <tr>
                <th>Deploy Date</th>
                <td>21st of December 2023</td>
            </tr>
            <tr>
                <th>Current Amount</th>
                <td>[web3 call]</td>
            </tr>
            <tr>
                <th>Unlock Date</th>
                <td>16th of September 2026</td>
            </tr>
            <tr>
                <th>Release Rate</th>
                <td>100 BSOV per week</td>
            </tr>
        </tbody>
    </table>
</section>



    </section>

    <!-- Advanced Features -->
    <section id="advanced-features">
        <h2>Advanced Features</h2>
        <p>
            For experienced users, SovCube offers a range of advanced features to explore. This section delves into these sophisticated functionalities, providing insights on how to leverage them for enhanced token management and engagement in SovCube's ecosystem.
        </p>
    </section>

    <!-- FAQs -->
    <section id="faqs">
        <h2>FAQs</h2>
        <p>
            Find quick answers to common questions about SovCube in this comprehensive FAQ section. It covers a wide range of topics, from basic queries to more complex issues, helping you resolve common problems and understand SovCube's operations better.
        </p>
	<h3>Question: Will I get dividends from timelocking my tokens in SovCube?</h3>
<p>No. There aren't any dividends embedded in the timelocking contracts of SovCube. However, the community can possibly reward you already timelocked tokens by using the "Giveaway-function" in Contract 2.</p>
<h3>Question: Is timelocking the same as staking?</h3>
<p>No. Timelocking is not the same as staking. Timelocking in SovCube is the act of voluntarily locking your tokens for a period of time, and there is a Slow-Release mechanism which has a certain withdrawal rate per week. In SovCube there is no staking. Staking is the act of depositing your tokens, and receive dividends, and at any time withdraw the tokens.</p>   
 </section>

    <!-- Support and Community -->
    <section id="support">
        <h2>Support and Community</h2>
        <p>
            Connect with the SovCube community and get support for any challenges you face. This section provides contact information for SovCube's support team and links to community forums where you can interact with other users and share experiences.
        </p>
    </section>

    <!-- Legal and Compliance -->
    <section id="legal">
        <h2>Legal and Compliance</h2>
        <p>
            Familiarize yourself with the legal aspects of using SovCube. This section outlines the necessary disclaimers, terms of use, and compliance information to ensure that you are fully aware of the legal considerations associated with SovCube.
        </p>
    </section>
</div>






<!--<script src="/dapp/app.js"></script>-->

</div>
</body>
</html>
