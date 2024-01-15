<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SovCube dApp</title>


<!-- Bootstrap CSS -->
<!--<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">-->

<!-- Bootstrap JS and its dependencies -->
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>




    <link rel="stylesheet" href="/dapp/styles.css">
<link rel="icon" href="/images/favicon-logo.png" type="image/x-icon">
    <!-- Include web3.js or other necessary scripts -->

<!--<script src="/dapp/web3@4.3.0.js"> </script> -->
<!--<script src="https://cdn.jsdelivr.net/npm/web3@4.2.2/lib/commonjs/web3.min.js"></script>-->
<script src="https://cdn.jsdelivr.net/npm/web3/dist/web3.min.js"></script>


</head>
<body>
<?php include $_SERVER['DOCUMENT_ROOT'] . '/menu.php'; ?>
<?php include $_SERVER['DOCUMENT_ROOT'] . '/connect.php'; ?>
<h1 class="dapp-heading">SovCube Timelocking dApp</h1>
<p id="connectYourWalletText"><span class="connectWalletTextClass">Connect your wallet to continue.<br></span>Use a browser like <a href="https://brave.com" target="_blank">Brave Browser</a> or Google Chrome and download the <a href="https://metamask.io/download/" target="_blank">Metamask wallet extension</a> to be able to connect.<br><br><span style="color:red;">Strongly Recommended to read up at <a href="/docs" target="_blank">Docs & Help</a> before you timelock any tokens.</span></p>
<!--<div id="contractInfoContainer">
    <div id="contract1InfoSection">
        <h3 class="contract1infoheader" style="display:none;">Contract 1 Info:</h3>
        <span id="contract1DynamicInfo"></span>
    </div>
    <div id="contract2InfoSection">
        <h3 class="contract2infoheader" style="display:none;">Contract 2 Info:</h3>
        <span id="contract2DynamicInfo"></span>
    </div>
</div>
-->
    <div class="container">
        <div class="contract-selection" style="display: none;">
            <select id="contractSelect" class="contractSelect">
		<option value="select">Select Contract &#x21B4</option>
                <option value="contract1">Contract 1</option>
                <option value="contract2">Contract 2</option>
            </select>
        </div>

<p id="contract-explanation">To begin using the SovCube dApp you have to select a contract to interact with. The contracts have different parameters, and you should read the documentation before you timelock your tokens.</p>

<div id="fieldContainer">
<!--<p id="contract1Explanation">Contract 1 was deployed in August, 2019 and allows you to timelock and withdraw BSOV Tokens. See <a href="/docs">Docs & Help</a> for more info.</p> -->
<!--<p id="contract2Explanation">Contract 2 was deployed in December, 2023 and allows you to timelock, withdraw and giveaway timelocked BSOV Tokens. See <a href="/docs">Docs & Help</a> for more info.</p>-->

<p id="contract1Explanation">
  Contract 1: Timelock & Withdraw BSOV Tokens. 
  <a href="/docs/index.php/#smart-contract" target="_blank" data-toggle="tooltip" title="Deployed in August 2019. Click 'More Info' to see info about Smart-Contract Details.">More Info</a>
</p>
<p id="contract2Explanation">
  Contract 2: Timelock, Withdraw & Send Timelocked BSOV Tokens. 
  <a href="/docs/index.php/#smart-contract" target="_blank" data-toggle="tooltip" title="Deployed in December 2023. Click 'More Info' to see info about Smart-Contract Details.">More Info</a>
</p>

<script>
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip(); 
});
</script>


        <!-- Contract 1 Details -->
<div id="contract1Details" class="contract-details" style="display: none;">
    <div class="radio-buttons">
        <input type="radio" id="timelock1" name="contract1Action" value="timelock">
        <label for="timelock1" data-toggle="tooltip" title="Lock your tokens for a pre-set period of time. Tokens cannot be accessed until the Unlock Date is reached.">Timelock</label>
        <input type="radio" id="withdraw1" name="contract1Action" value="withdraw">
        <label for="withdraw1" data-toggle="tooltip" title="Retrieve your timelocked tokens after the Unlock Date is reached, adhering to the weekly Withdrawal Rate limits.">Withdraw</label>
    </div>
    <input type="number" id="amount1" placeholder="Amount of BSOV">
<!-- Contract 1 - Timelock and Withdraw Buttons -->
<button class="button" id="timelock1Button">Timelock Now</button>
<button class="button" id="withdraw1Button">Withdraw Now</button>


</div>


        <!-- Contract 2 Details -->
        <div id="contract2Details" class="contract-details" style="display: none;">
            
            <div class="radio-buttons">
                <input type="radio" id="timelock2" name="contract2Action" value="timelock">
                <label for="timelock2" data-toggle="tooltip" title="Lock your tokens for a pre-set period of time. Tokens cannot be accessed until the Unlock Date is reached.">Timelock</label>
                <input type="radio" id="withdraw2" name="contract2Action" value="withdraw">
                <label for="withdraw2" data-toggle="tooltip" title="Retrieve your timelocked tokens after the Unlock Date is reached, adhering to the weekly Withdrawal Rate limits.">Withdraw</label>
                <input type="radio" id="giveaway" name="contract2Action" value="giveaway">
                <label for="giveaway" data-toggle="tooltip" title="Transfer your timelocked tokens to someone else's 'Incoming Tokens Account'. When these tokens are claimed using the 'Accept Incoming Tokens' button, their Unlock Date resets to 1000 days.">Send Locked Tokens</label>
            </div>
            <input type="number" id="amount2" placeholder="Amount of BSOV">
<div class="checkbox-container">		
<input type="checkbox" id="account-checkbox">
<label for="account-checkbox" id="account-checkbox-label">Withdraw from <b>Incoming Tokens Account?</b></label>
</div>
            <textarea id="ethAddresses" placeholder="Enter ETH addresses to giveaway timelocked tokens to (one address per line)"></textarea>
	    <textarea id="giveawayAmounts" placeholder="Enter BSOV amounts (one amount per line)"></textarea>
          <!-- Contract 2 - Timelock, Withdraw, and Giveaway Buttons -->
<button class="button" id="timelock2Button">Timelock Now</button>
<button class="button" id="withdraw2Button">Withdraw Now</button>
<button class="button" id="giveaway2Button">Giveaway Now</button>



        </div>
    </div>
</div>
<div id="errorMessage" style="color: red;"></div><span id="clearError" style="cursor: pointer; padding: 0 5px; display:none;">X</span>


<script>
document.getElementById('clearError').addEventListener('click', function() {
    document.getElementById('errorMessage').innerText = '';
    document.getElementById('clearError').style.display = 'none';
});

</script>


<div id="contractInfoContainer">
    
    <div id="contract1InfoSection">
        <h3 class="contract1infoheader" style="display:none;">Contract 1 Info:</h3>
        <span id="contract1DynamicInfo"></span>
    </div>

    <div id="contract2InfoSection">
    <h3 class="contract2infoheader" style="display:none;">Contract 2 Info:</h3>
	      <div id="mainContractInfo">
	      </div>
	<div class="contract-info-container">
	      
		<div class="second-line-container">
	     <div class="contract-info-style" id="regularAccountContainer">
	      <div id="regularAccount">
	      </div>
		</div>

	      <div class="contract-info-style" id="incomingAccountContainer">
               <div id="incomingTokensAccount">   
	      </div>	
	              <button id="claimGiveawayButton" data-toggle="tooltip" title="Accepting Incoming Tokens will reset the lock period of any existingtimelocked balance in your 'Incoming Tokens Account' to a full 1000 days. This will not affect the lock period of your Regular Account.">Accept Incoming Tokens</button>
		</div>
	</div>

	      <div class="contract-info-style" id="giveawayAccountContainer">
               <div id="giveawayAccount">
	      </div>	
              <button id="claimGiveawayReserveButton" data-toggle="tooltip" title="If you timelock BSOV tokens, you'll be worthy of Giveaway rewards! The tokens will be transferred to your 'Incoming Tokens' balance">Claim Giveaway Tokens</button>
		</div>
	</div>
         
     </div>

 <p style="font-size:7pt; text-align:center; letter-spacing:1.5px;">Balances update every 15 seconds</p>

</div>

<div class="terms-container">
    <p class="terms">Everything on this site is provided "as-is" and SovCube.com has no responsibilities. Everything you do and see on this website is 100% your responsibility. This is because SovCube is purely a voluntary community initiative.</p>
 <a href="#" id="toggleTerms" class="toggle-terms">Disclaimer</a>
</div>
<script>
document.getElementById('toggleTerms').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default anchor behavior
    var terms = document.querySelector('.terms');

    if (terms.style.display === "none" || terms.style.display === "") {
        terms.style.display = "block";
        setTimeout(function() {
            terms.style.opacity = 1;
        }, 10); // Timeout ensures the opacity transition occurs
    } else {
        terms.style.opacity = 0;
        setTimeout(function() {
            terms.style.display = "none";
        }, 100); // Matches the duration of the fade effect
    }
});

</script>

<!--<script src="/dapp/connect.js"> </script>-->
<!--<script src="/dapp/bignumber.js"></script>-->
<script src="/dapp/app.js"></script>
<script src="/dapp/contract1-calls.js"> </script>
<script src="/dapp/contract2-calls.js"> </script>
<script src="/dapp/bsov-calls.js"> </script>


 
   
</body>
</html>

