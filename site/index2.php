
<?php

?>



<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SovCube</title>
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="styles-fonts.css">
<link rel="icon" href="/images/favicon-logo.png" type="image/x-icon">

<script type="text/javascript">
        function showMessage() {
            document.getElementById('message').style.display = 'block';
        }
    </script>
<!--<script src="https://cdn.jsdelivr.net/npm/web3/dist/web3.min.js"></script>-->



</head>

<?php include $_SERVER['DOCUMENT_ROOT'] . '/menu.php'; ?>
<body>


<center><img class="img-fade"  src="/images/Sovcube-BSOV-no-text.png" height=300px width=auto style="opacity:0.9; position:fixed; z-index:-1; margin-left:-17%; margin-top:400px;"></img> </center>

<div class="body-container">

<div class="blurred-background"></div>
    <div class="text-container">
<center><h1 class="brand-name">SovCube</h1></center>
    <center><h2>Freedom to Save Money</h2></center>
    <p><strong>Freedom to Save Money is Financial Freedom.</strong>
Keep your <a href="https://bsovtoken.com" target="_blank">BSOV Tokens</a> safe and help them grow with SovCube. In a cryptocurrency market that's risky and always changing, thinking long-term is really important.
SovCube doesn't just keep your tokens safe; it also helps them become more valuable as time goes on.
Use SovCube's web3 dApp to make your BSOV tokens stronger and more stable for the future.
</p>
<br><br>
  <center><h3>Earn Rewards While Securing Your BSOV Tokens with SovCube's Time-Lock Feature</h3></center>
    <p>
SovCube offers a smart way to time-lock your BSOV tokens using the web3 interface, demonstrating your commitment to BSOV Token's long-term value.
The unique Slow-Release feature gradually reintroduces BSOV tokens to the cryptocurrency market after the time-lock period,
preventing market shocks and maintaining supply stability.
This responsible approach fosters trust and sustains long-term value, making SovCube an ideal choice for forward-thinking token holders.
</p>
</div>

<div class="button-container">
	<button onclick="window.location.href='/dapp/index.php'" class="launch-button">Launch dApp</button>
<p id="message" style="display: none; color: red; margin-top: 10px;">Under construction</p>
</div>


</div>
</div>
<script>
window.onload = function() {
    setTimeout(function() {
        document.querySelector('.body-container').classList.add('bg-loaded');
    }, 2000); // Wait for 2000 milliseconds before executing the code inside the function
};

</script>

</body>
</html>

