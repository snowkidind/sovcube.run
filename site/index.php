
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


<?php  include $_SERVER['DOCUMENT_ROOT'] . '/tag.php';  
?>

</head>

<?php // include $_SERVER['DOCUMENT_ROOT'] . '/menu.php'; 
?>
<body>


<center><img class="img-fade"  src="/images/Sovcube-BSOV-no-text.png" height=300px width=auto style="opacity:0.9; position:fixed; z-index:-1; margin-left:-17%; margin-top:400px;"></img> </center>

<div class="body-container">

<div class="blurred-background"></div>
    <div class="text-container">
<center><h1 class="brand-name">SovCube</h1></center>
    <center><h2>Timelock and Rewards web3 dApp<br>Coming Soon</h2></center>
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

