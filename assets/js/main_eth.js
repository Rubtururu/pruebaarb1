var web3;
var spend;
var usrBal;
var priceInUSD;
var lastNumEggs=-1
var lastNumMiners=-1
var maxDeposit = 0
var minDeposit = 0
var eggstohatch1 = 0
var lastHatchTime = 0
var totalDeposits = 0
var dripAirdropped = 0
var lastSecondsUntilFull = 100
var canGetHistory = true;
var historyStep = 5000;
var historyStepTimes = 5;
var contract;
var _web3;
var _contract;
var contractBalance;
var currentAddr = null;
var lastUpdate = new Date().getTime()
var actionCooldown = 0;
var cutoffStep = 0;

const minerAddress = '0x5558a00F761123d94BC8E400bd73143A0080e082' // Mainnet Final
const tokenAddress = '0xe9e7cea3dedca5984780bafc599bd69add087d56' // Mainnet BUSD

var tokenContract;
var started = true;
var canSell = true;
var whitelistActive = false;

const tokenAbi = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"_decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
const minerAbi = [{"inputs":[{"internalType":"address","name":"_dev1","type":"address"},{"internalType":"address","name":"_dev2","type":"address"},{"internalType":"address","name":"_charity","type":"address"},{"internalType":"address","name":"_treasury","type":"address"},{"internalType":"address","name":"_genesis","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"investor","type":"address"},{"indexed":false,"internalType":"uint256","name":"pot","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"miner","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"round","type":"uint256"}],"name":"LotteryWinner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"addr","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PoolPayout","type":"event"},{"inputs":[],"name":"ACTION_COOLDOWN","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"value","type":"address"}],"name":"CHANGE_OWNERSHIP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"CUTOFF_STEP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"EGGS_TO_HIRE_1MINERS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"value","type":"bool"}],"name":"ENABLE_LOTTERY","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"value","type":"bool"}],"name":"ENABLE_TOP_DEPOSIT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"LOTTERY_ACTIVATED","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"LOTTERY_PERCENT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"LOTTERY_START_TIME","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"LOTTERY_STEP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"LOTTERY_TICKET_PRICE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MARKET_EGGS_DIVISOR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_LOTTERY_PARTICIPANTS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_LOTTERY_POOL_PER_ROUND","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_LOTTERY_TICKET","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MIN_INVEST","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PERCENTS_DIVIDER","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"PRC_EGGS_TO_HIRE_1MINERS","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"REFERRAL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"SET_REF_PERCENTAGE","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"TOP_DEPOSIT_ACTIVATED","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TOP_DEPOSIT_PERCENT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TOP_DEPOSIT_START_TIME","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TOP_DEPOSIT_STEP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"WALLET_DEPOSIT_LIMIT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"activateLaunch","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"ref","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"buyEggs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"eth","type":"uint256"},{"internalType":"uint256","name":"contractBalance","type":"uint256"}],"name":"calculateEggBuy","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"eth","type":"uint256"}],"name":"calculateEggBuySimple","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"eggs","type":"uint256"}],"name":"calculateEggSell","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"eggs","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"calculateEggSellForYield","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"rt","type":"uint256"},{"internalType":"uint256","name":"rs","type":"uint256"},{"internalType":"uint256","name":"bs","type":"uint256"}],"name":"calculateTrade","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"currentPot","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"fundFromGenesis","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_adr","type":"address"}],"name":"getAvailableEarnings","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"adr","type":"address"}],"name":"getEggsSinceLastHatch","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"getEggsYield","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"eggValue","type":"uint256"}],"name":"getFees","outputs":[{"internalType":"uint256","name":"_dev1Fee","type":"uint256"},{"internalType":"uint256","name":"_dev2Fee","type":"uint256"},{"internalType":"uint256","name":"_charityFee","type":"uint256"},{"internalType":"uint256","name":"_treasuryFee","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getLotteryHistory","outputs":[{"internalType":"uint256","name":"round","type":"uint256"},{"internalType":"address","name":"winnerAddress","type":"address"},{"internalType":"uint256","name":"pot","type":"uint256"},{"internalType":"uint256","name":"miners","type":"uint256"},{"internalType":"uint256","name":"totalLotteryParticipants","type":"uint256"},{"internalType":"uint256","name":"totalLotteryTickets","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLotteryInfo","outputs":[{"internalType":"uint256","name":"lotteryStartTime","type":"uint256"},{"internalType":"uint256","name":"lotteryStep","type":"uint256"},{"internalType":"uint256","name":"lotteryCurrentPot","type":"uint256"},{"internalType":"uint256","name":"lotteryParticipants","type":"uint256"},{"internalType":"uint256","name":"maxLotteryParticipants","type":"uint256"},{"internalType":"uint256","name":"totalLotteryTickets","type":"uint256"},{"internalType":"uint256","name":"lotteryTicketPrice","type":"uint256"},{"internalType":"uint256","name":"maxLotteryTicket","type":"uint256"},{"internalType":"uint256","name":"lotteryPercent","type":"uint256"},{"internalType":"uint256","name":"round","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLotteryTimer","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMyEggs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMyMiners","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getSiteInfo","outputs":[{"internalType":"uint256","name":"_totalStaked","type":"uint256"},{"internalType":"uint256","name":"_totalDeposits","type":"uint256"},{"internalType":"uint256","name":"_totalCompound","type":"uint256"},{"internalType":"uint256","name":"_totalRefBonus","type":"uint256"},{"internalType":"uint256","name":"_totalTopDepositMinerBonus","type":"uint256"},{"internalType":"uint256","name":"_totalLotteryMinerBonus","type":"uint256"},{"internalType":"uint256","name":"_pool_balance","type":"uint256"},{"internalType":"uint256","name":"_pool_leader","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTimeStamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_adr","type":"address"}],"name":"getUserBonusInfo","outputs":[{"internalType":"uint256","name":"_lottery_bonus_as_miners","type":"uint256"},{"internalType":"uint256","name":"_pool_bonus_as_miners","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_adr","type":"address"}],"name":"getUserInfo","outputs":[{"internalType":"uint256","name":"_initialDeposit","type":"uint256"},{"internalType":"uint256","name":"_userDeposit","type":"uint256"},{"internalType":"uint256","name":"_miners","type":"uint256"},{"internalType":"uint256","name":"_claimedEggs","type":"uint256"},{"internalType":"uint256","name":"_lastHatch","type":"uint256"},{"internalType":"address","name":"_referrer","type":"address"},{"internalType":"uint256","name":"_referrals","type":"uint256"},{"internalType":"uint256","name":"_totalWithdrawn","type":"uint256"},{"internalType":"uint256","name":"_referralEggRewards","type":"uint256"},{"internalType":"uint256","name":"_referralMinerRewards","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_userAddress","type":"address"}],"name":"getUserTickets","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"isCompound","type":"bool"}],"name":"hatchEggs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"Wallet","type":"address"}],"name":"isBlacklisted","outputs":[{"internalType":"bool","name":"blacklist","type":"bool"},{"internalType":"uint256","name":"hireAttemptCount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"Wallet","type":"address"}],"name":"isWhitelisted","outputs":[{"internalType":"bool","name":"whitelist","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lotteryRound","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"marketEggs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"max_pool_balance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"participantAdresses","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"participants","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"poolTopInfo","outputs":[{"internalType":"address[5]","name":"addrs","type":"address[5]"},{"internalType":"uint256[5]","name":"deps","type":"uint256[5]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pool_balance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"pool_bonuses","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pool_cycle","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"","type":"uint8"}],"name":"pool_top","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"pool_users_deposits_sum","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"runEvents","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"sellEggs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"totalAmount","type":"uint256"}],"name":"setTotalDripAirdropped","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"isActive","type":"bool"}],"name":"setWhitelistActive","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"ticketOwners","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token_BUSD","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalCompound","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDeposits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDripAirdropped","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalLotteryMinerBonus","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalRefBonus","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalStaked","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalTickets","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalTopDepositMinerBonus","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalWithdrawn","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"users","outputs":[{"internalType":"uint256","name":"initialDeposit","type":"uint256"},{"internalType":"uint256","name":"userDeposit","type":"uint256"},{"internalType":"uint256","name":"miners","type":"uint256"},{"internalType":"uint256","name":"claimedEggs","type":"uint256"},{"internalType":"uint256","name":"lottery_bonus_as_miners","type":"uint256"},{"internalType":"uint256","name":"lastHatch","type":"uint256"},{"internalType":"address","name":"referrer","type":"address"},{"internalType":"uint256","name":"referralsCount","type":"uint256"},{"internalType":"uint256","name":"referralEggRewards","type":"uint256"},{"internalType":"uint256","name":"referralMinerRewards","type":"uint256"},{"internalType":"uint256","name":"totalWithdrawn","type":"uint256"},{"internalType":"uint256","name":"pool_bonus_as_miners","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"whitelistActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"},{"internalType":"bool","name":"value","type":"bool"}],"name":"whitelistAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"addr","type":"address[]"},{"internalType":"bool","name":"whitelist","type":"bool"}],"name":"whitelistAddresses","outputs":[],"stateMutability":"nonpayable","type":"function"}]
// ------ contract calls

function loadContracts() {
    console.log('Loading contracts...')
    web3 = window.web3
    contract = new web3.eth.Contract(minerAbi, minerAddress);
    tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);
	_web3 = new Web3('https://capable-light-sea.bsc.discover.quiknode.pro/c1be1f8b7d190b1c93a08b40b71c603bd315ac6c/');
	_contract = new _web3.eth.Contract(minerAbi, minerAddress);
    console.log('Done loading contracts.')
}

function myReferralLink(address) {
    var prldoc = document.getElementById('reflink')
    prldoc.textContent = window.location.origin + "?ref=" + address
    var copyText = document.getElementById("reflink");
    copyText.value = prldoc.textContent
}

async function connect() {
    console.log('Connecting to wallet...')
    try {
        if (started) {
            $('#buy-eggs-btn').attr('disabled', false)
        }
        var accounts = await ethereum.request({ method: 'eth_requestAccounts' })
        if (accounts.length == 0) {
            console.log('Please connect to MetaMask.');
            $('#enableMetamask').html('Connect')
        } else if (accounts[0] !== currentAddr) {
            currentAddr = accounts[0];
            if (currentAddr !== null) {
                myReferralLink(currentAddr)
                console.log('Wallet connected = '+ currentAddr)

                loadContracts()
                refreshData()

                let shortenedAccount = currentAddr.replace(currentAddr.substring(3, 38), "***")
                $('#enableMetamask').html(shortenedAccount)
            }
            $('#enableMetamask').attr('disabled', true)
        }
    } catch (err) {
        if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            alert('Please connect to MetaMask.');
        } else {
            console.error(err);
        }
        $('#enableMetamask').attr('disabled', false)
    }
}

async function loadWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        $('#enableMetamask').attr('disabled', false)
        if (window.ethereum.selectedAddress !== null) {
            await connect();
                setTimeout(function () {
                controlLoop()
                controlLoopFaster()
            }, 1000)
        }
    } else {
        $('#enableMetamask').attr('disabled', true)
    }
}

window.addEventListener('load', function () {
//    setStartTimer();
    loadWeb3()
})

$('#enableMetamask').click(function () {
    connect()
});

function controlLoop() {
    refreshData()
    setTimeout(controlLoop, 25000)
}

function controlLoopFaster() {
    setTimeout(controlLoopFaster, 30)
}

function roundNum(num) {
    if (num == 0) { return 0};
    if (num < 1) {
        return parseFloat(num).toFixed(4)
    }
    return parseFloat(parseFloat(num).toFixed(2));
}

function refreshData() {
    if(!contract || !contract.methods){
    	console.log('contract is not yet loaded.')
	loadContracts()    
    }	
    contract.methods.EGGS_TO_HIRE_1MINERS().call().then(eggs => {
        eggstohatch1 = eggs
        
        var dailyPercent = Number((77760 / eggstohatch1) * 100).toFixed(2);
        var apr = dailyPercent * 365;
        $("#daily-rate").html(`${dailyPercent}% Daily ~ ${apr}% APR.`);
    }).catch((err) => {
        console.log(err);
    });

    contract.methods.CUTOFF_STEP().call().then(cutoff => {
        cutoffStep = cutoff;
    }).catch((err) => {
        console.log(err);
    })

     contract.methods.ACTION_COOLDOWN().call().then(cooldown => {
         actionCooldown = cooldown;
     }).catch((err) => {
         console.log(err);
     })

    contract.methods.REFERRAL().call().then(r => {
        var refPercent = Number(r / 10).toFixed(0);
        $("#ref-bonus").html(`${refPercent}% Referrals Converted As Miners.`)
        $("#ref-percent").html(`${refPercent}%`)
    }).catch((err) => {
        console.log(err);
    });

    contract.methods.MIN_INVEST().call().then(busd => {
        minDeposit = busd;
        $("#min-invest").html(`${readableBUSD(busd, 2)} BUSD`)
    }).catch((err) => {
        console.log(err);
    });

    contract.methods.WALLET_DEPOSIT_LIMIT().call().then(busd => {
        maxDeposit = busd;
        $("#max-deposit").html(`${readableBUSD(busd, 2)} BUSD`)
    }).catch((err) => {
        console.log(err);
    });
    
    contract.methods.totalDripAirdropped().call().then(drip => {
        dripAirdropped = drip;
        $("#drip-airdropped").html(`${drip}`)
    }).catch((err) => {
        console.log(err);
    });

    tokenContract.methods.balanceOf(currentAddr).call().then(userBalance => {
        let amt = web3.utils.fromWei(userBalance);
        usrBal = userBalance;
        $('#user-balance').html(roundNum(amt))
    }).catch((err) => {
        console.log(err)
    });

    tokenContract.methods.allowance(currentAddr, minerAddress).call().then(result => {
        spend = web3.utils.fromWei(result)
        if (spend > 0 && started) {
            $('#user-approved-spend').html(roundNum(spend));
            $("#buy-eggs-btn").attr('disabled', false);
            $("#busd-spend").attr('hidden', false);
            $("#busd-spend").attr('value', "50");
        }
    }).catch((err) => {
        console.log(err)
    });

    /** How many miners and eggs per day user will recieve for 500 BUSD deposit **/
    contract.methods.getEggsYield(web3.utils.toWei('500')).call().then(result => {
        var miners = result[0];
        var busd = result[1];
        var amt = readableBUSD(busd, 4);

        $("#example-miners").html(miners)
        $("#example-busd").html(roundNum(amt))
        // var usd = Number(priceInUSD*amt).toFixed(2);
        // $("#example-usd").html(usd)
    }).catch((err) => {
        console.log(err);
    });

    if (started) {
        contract.methods.getBalance().call().then(balance => {
            contractBalance = balance;
            var amt = web3.utils.fromWei(balance);
            $('#contract-balance').html(roundNum(amt));
            // var usd = Number(priceInUSD*amt).toFixed(2);
            // $("#contract-balance-usd").html(usd)
        }).catch((err) => {
            console.log(err);
        });

        contract.methods.getSiteInfo().call().then(result => {
            var staked = web3.utils.fromWei(result._totalStaked);
            $('#total-staked').html(roundNum(staked));
            // var stakedUSD = Number(priceInUSD*staked).toFixed(2);
            // $("#total-staked-usd").html(stakedUSD)	
            $('#total-players').html(result._totalDeposits);
			$('#total-lottery-bonus').html(result._totalLotteryMinerBonus);
			$('#total-top-deposit-bonus').html(result._totalTopDepositMinerBonus);
            var pool = web3.utils.fromWei(result._pool_balance);
			$('#pool-balance').html(roundNum(pool));
			$('#pool-leader').html(result._pool_leader);
            var ref = result._totalRefBonus;
            if (ref > 0) {
                var refBUSD = readableBUSD(ref, 2);
                $("#total-ref").html(refBUSD);
                // var refUSD = Number(priceInUSD*refBUSD).toFixed(2);
                // $('#total-ref-usd').html(refUSD)
            }
        }).catch((err) => {
            console.log(err);
        });
    }
    // web3.eth.getBalance(currentAddr).then(userBalance => {
    //     usrBal = userBalance;
    //     var amt = web3.utils.fromWei(userBalance);
    //     $("#user-balance").html(roundNum(amt));
    //     var usd = Number(priceInUSD*amt).toFixed(2);
    //     $("#user-balance-usd").html(usd)
    // }).catch((err) => {
    //     console.log(err);
    // });

    contract.methods.getUserInfo(currentAddr).call().then(user => {
        var initialDeposit = user._initialDeposit;
        var userDeposit = user._userDeposit;
        var miners = user._miners;
        var totalWithdrawn = user._totalWithdrawn;
        var lastHatch = user._lastHatch;
        var referrals = user._referrals;
        var referralEggRewards = user._referralEggRewards;
        var referralMinerRewards = user._referralMinerRewards;
        var now = new Date().getTime() / 1000;

        var diff = (+lastHatch + +actionCooldown) - now;
        if (diff > 0) {
            setCompoundTimer(lastHatch);
        } else {
            $(".compound-timer").text("00:00:00");
            $('#reinvest').attr('disabled', false)
        }
        $("#reinvest").text("Compound");

        var cutOffDiff = (+lastHatch + +cutoffStep) - now;
        if (cutOffDiff > 0) {
            setCutoffTimer(lastHatch)
        } else {
            $("#claim-timer").html("00:00:00")
        }

        var coolDownDiff = (+lastHatch + +actionCooldown) - now;
        if (coolDownDiff > 0) {
            setCooldownTimer(coolDownDiff)
        } else {
            $("#cooldown-timer").html("");
            $("#withdraw").attr('disabled', false);
        }

        if (miners > 0) {
            $("#your-miners").html(miners);
            contract.methods.getAvailableEarnings(currentAddr).call().then(function (earnings) {
                var busdMined = readableBUSD(earnings, 4)
                $("#mined").html(busdMined);
                // var minedUsd = Number(priceInUSD*busdMined).toFixed(2);
                // $('#mined-usd').html(minedUsd)
            });
        } else {
            $("#mined").html(0);
        }

        if (referralEggRewards > 0) {
            var refBUSD = readableBUSD(referralEggRewards, 2);
            $("#ref-rewards-busd").html(refBUSD);
            // var refUSD = Number(priceInUSD*refBUSD).toFixed(2);
            // $('#ref-rewards-usd').html(refUSD)
            $('#ref-count').html(referrals);
        } else {
            $("#ref-rewards").html("0".concat(' '.concat('Miners')));
        }

        if (referralMinerRewards > 0) {
            $("#ref-rewards-miners").html(referralMinerRewards);
        }

        //if (totalLotteryBonus > 0) {
        //    contract.methods.calculateEggSell(totalLotteryBonus).call().then(function (refRewards) {
        //        var lotteryBUSD = readableBUSD(refRewards, 2);
        //        $("#lottery-rewards-busd").html(lotteryBUSD);
        //    });
        //}
        setInitialDeposit(initialDeposit);
        setTotalDeposit(userDeposit);
        setTotalWithdrawn(totalWithdrawn);


        if (miners > 0) {
            var eggsPerDay = 24 * 60 * 60 * miners ;
            contract.methods.calculateEggSellForYield(eggsPerDay, web3.utils.toWei('100')).call().then(earnings => {
                var eggsBUSD = readableBUSD(earnings, 4)
                $("#eggs-per-day").html(eggsBUSD);
                // var eggsUSD = Number(priceInUSD*eggsBUSD).toFixed(2);
                // $('#eggs-per-day-usd').html(eggsUSD)
            });
        }
    }).catch((err) => {
        console.log(err);
    });
	
	contract.methods.getUserBonusInfo(currentAddr).call().then(result => {
        var lotteryMiners = result._lottery_bonus_as_miners;
        var topDepositMiners = result._lottery_bonus_as_miners;
		$("#lottery-user-miners").html(lotteryMiners);
		$("#top-deposit-user-miners").html(topDepositMiners);
    }).catch((err) => {
        console.log(err)
    });
	
	contract.methods.poolTopInfo().call().then(result => {
        for (var i = 0; i < result.addrs.length; i++) {
			let topAddress = result.addrs[i];
			let shortenedAddress = topAddress.replace(topAddress.substring(3, 38), "***")
			$("#ref-cur-"+i).html(shortenedAddress);
			$("#ref-cur-deps-"+i).html(readableBUSD(result.deps[i]));
		}
    }).catch((err) => {
        console.log(err)
    });
	

    contract.methods.getLotteryInfo().call().then(result => {
        var round = result.round;
        if (round) {
            $("#lottery-round").text(`Round ${(+round+1)}`);
            contract.methods.ticketOwners(round, currentAddr).call().then(numTix => {
                if (numTix && numTix > 0) {
                    var max = result.maxLotteryTicket;
                    var totalTickets = result.totalLotteryTickets;
                    $("#lotto-chance").html(`${(numTix/totalTickets*100).toFixed(2)}%`);
                    $("#your-tickets").html(numTix);
                    $("#max-user-tickets").html(max-numTix);
                }
            }).catch((err) => {
                console.log(err)
            });
            if (round >= 1) {
                contract.methods.getLotteryHistory(round-1).call().then(winner => {
                    var winnerAddress = winner.winnerAddress;
                    let shortenedAddr = winnerAddress.replace(winnerAddress.substring(3, 38), "***")
                    $("#previous-winner").html(shortenedAddr.toLowerCase());
                    var prevPotBUSD = readableBUSD(winner.pot, 4);
                    $("#previous-pot-busd").html(prevPotBUSD);
                    $("#previous-pot-miners").html(winner.miners);
                }).catch((err) => {
                    console.log(err)
                });
            }
        }
        var participants = result.lotteryParticipants;
        $("#round-participants").html(participants);

        var amt = readableBUSD(result.lotteryCurrentPot, 4);  
        $("#lottery-pot").html(amt);

        var start = result.lotteryStartTime;
        const dateStart = new Date(start*1000).toLocaleString();

        $("#lottery-start").html(dateStart);
        var step = result.lotteryStep;
        var numStart = +start;
        var numStep = +step;
        const dateEnd = new Date((numStart+numStep)*1000).toLocaleString();
        $("#lottery-end").html(dateEnd);

        var lotteryPrice = result.lotteryTicketPrice;
        if (lotteryPrice) {
            var _price = web3.utils.fromWei(lotteryPrice);
            $("#ticket-price").html(roundNum(_price))
        }
    }).catch((err) => {
        console.log(err)
    });
		
	if (!displayTopDepositHistoryTimer) {
		displayTopDepositHistoryTimer = setInterval(function() {
			if (canGetHistory) {
				displayTopDepositHistory();
			}
		}, 1000);
	}
	
	setTopDepositTimer();
    updateBuyPrice();
}

var displayTopDepositHistoryTries = 0;
var displayTopDepositHistoryTimer;
function displayTopDepositHistory() {
	canGetHistory = false;
	web3.eth.getBlockNumber().then( async currentBlock => {
		const topDeposits = [];
		const topDepositRewards = [];

		let step = historyStep;

		for(let offset = step; offset < step * historyStepTimes; offset += step) { 

			let result = await _contract.getPastEvents("PoolPayout", {                               
				fromBlock: currentBlock - offset,     
				toBlock: currentBlock - offset + step  
			});

			for(var i = result.length; i > result.length - 5; i--) {
				let eventItem = result[i-1];
				if(typeof(eventItem) != "undefined") {
					if(topDeposits.indexOf(eventItem.returnValues[0]) == -1) {
						topDeposits.push(eventItem.returnValues[0]);
						topDepositRewards.push(eventItem.returnValues[1]);
					}
				}
				if(topDeposits.length >= 5) {
				break; 
				}
			}
		}
		if (topDeposits.length > 0) {
			const arrangedTopDeposits = topDeposits.reverse();
			const arrangedTopDepRewards = topDepositRewards.reverse();

			for (var i = 0;i < arrangedTopDeposits.length;i++) {
				var topAddress = arrangedTopDeposits[i];
				let shortenedAddress = topAddress.replace(topAddress.substring(3, 38), "***")

				$("#ref-prev-" + i).html(shortenedAddress);
				$("#ref-prev-deps-" + i).html(arrangedTopDepRewards[i]);
			}
		}

		canGetHistory = true;
		clearInterval(displayTopDepositHistoryTimer);
		displayTopDepositHistoryTries = 0;

	}).catch((err) => {
		console.log(err);
		canGetHistory = true;
		displayTopDepositHistoryTries++;
		if (displayTopDepositHistoryTries >= 5) {
			clearInterval(displayTopDepositHistoryTimer);
			displayTopDepositHistoryTries = 0;
		}
	});
}

let j;
function setTopDepositTimer(){
	contract.methods.TOP_DEPOSIT_STEP().call().then(lastDepositStep => {
		contract.methods.TOP_DEPOSIT_START_TIME().call().then(topDepositStart => {
			var time = new Date().getTime();
			var cutoff = (+topDepositStart + +lastDepositStep) - (+time/1000);
			var countDownDate = new Date(+time + +cutoff * 1000).getTime();

			clearInterval(j)
			j = setInterval(function() {
				var currentTime = new Date().getTime();
				var distance = countDownDate - currentTime;

				var days = Math.floor(distance / (1000 * 60 * 60 * 24));
				var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) + days*24);
				var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
				var seconds = Math.floor((distance % (1000 * 60)) / 1000);

				if (hours < 10) { hours = '0' + hours; }
				if (minutes < 10) { minutes = '0' + minutes; }
				if (seconds < 10) { seconds = '0' + seconds; }

				$("#top-deposit-timer").html(`<strong> ${hours}h:${minutes}m:${seconds}s</strong>`);

				if (distance < 0) {
					clearInterval(j);
					$("#top-deposit-timer").html("<span> 0:00:00</span>");
				}
			}, 1000, 1);
		}).catch((err) => {
			console.log(err);
		});
	}).catch((err) => {
		console.log(err);
	});

	
}

function copyRef() {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($('#reflink').text()).select();
    document.execCommand("copy");
    $temp.remove();
    $("#copied").html("<i class='ri-checkbox-circle-line'> copied!</i>").fadeOut('10000ms')
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }        
    return (false);
}

function setInitialDeposit(initialDeposit) {
    totalDeposits = initialDeposit;
    var initialBUSD = readableBUSD(initialDeposit, 2);
    $("#initial-deposit").html(initialBUSD);
}

function setTotalDeposit(totalDeposit) {
    var totalBUSD = readableBUSD(totalDeposit, 2);
    $("#total-deposit").html(totalBUSD);
}

function setTotalWithdrawn(totalWithdrawn) {
    var totalBUSD = readableBUSD(totalWithdrawn, 2);
    $("#total-withdrawn").html(totalBUSD);
}

var x;
function setCompoundTimer(lastHatch) {
    $('#reinvest').attr('disabled', true)
    var now = new Date().getTime();
    var diff = (+lastHatch + +actionCooldown) - (now / 1000);
    var countDownDate = new Date(+now + +diff * 1000).getTime();

    clearInterval(x)
    x = setInterval(function () {
        var currTime = new Date().getTime();
        var distance = countDownDate - currTime;

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) + days*24);
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);


        if (hours < 10) { hours = '0' + hours; }
        if (minutes < 10) { minutes = '0' + minutes; }
        if (seconds < 10) { seconds = '0' + seconds; }

        $("#compound-timer").html(`${hours}h:${minutes}m:${seconds}s`);

        if (distance < 0) {
            $("#compound-timer").html("<span>00:00:00</span>");
            $('#reinvest').attr('disabled', false)
        }
    }, 1000, 1);
}

let y;
function setCutoffTimer(lastHatch) {
    var time = new Date().getTime();
    var cutoff = (+lastHatch + +cutoffStep) - (+time/1000);
    var countDownDate = new Date(+time + +cutoff * 1000).getTime();

    clearInterval(y)
    y = setInterval(function() {
        var currentTime = new Date().getTime();
        var distance = countDownDate - currentTime;

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) + days*24);
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (hours < 10) { hours = '0' + hours; }
        if (minutes < 10) { minutes = '0' + minutes; }
        if (seconds < 10) { seconds = '0' + seconds; }

        $("#claim-timer").html(`<strong>${hours}h:${minutes}m:${seconds}s</strong>`);

        if (distance < 0) {
            clearInterval(y);
            $("#claim-timer").html("<span>0:00:00</span>");
        }
    }, 1000, 1);
}

var z;
function setCooldownTimer(cooldown) {
    $("#withdraw").attr('disabled', true);
    var time = new Date().getTime();
    var endDate = new Date(+time + +cooldown * 1000).getTime();

    clearInterval(z)
    z = setInterval(function() {
        var currTime = new Date().getTime();

        var distance = endDate - currTime;
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)  + days*24);
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (hours < 10) { hours = '0' + hours; }
        if (minutes < 10) { minutes = '0' + minutes; }
        if (seconds < 10) { seconds = '0' + seconds; }

        $("#cooldown-timer").html(`in ${hours}h:${minutes}m:${seconds}s`);

        if (distance < 0) {
            clearInterval(z);
            $("#withdraw").attr('disabled', false);
            $("#cooldown-timer").html("");
        }
    }, 1000, 1);
}

//var startTimeInterval;
//function setStartTimer() {
//    var endDate = new Date('September 14, 2022 10:00 EST').getTime();

//    clearInterval(startTimeInterval)
//   startTimeInterval = setInterval(function() {
//        var currTime = new Date().getTime();

        // Find the distance between now and the count down date
//        var distance = endDate - currTime;
        // Time calculations for days, hours, minutes and seconds
//       var days = Math.floor(distance / (1000 * 60 * 60 * 24));
//        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)  + days*24);
//        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

//        if (hours < 10) { hours = '0' + hours; }
//        if (minutes < 10) { minutes = '0' + minutes; }
//        if (seconds < 10) { seconds = '0' + seconds; }

//        $("#start-timer").html(`${hours}h:${minutes}m:${seconds}s`);

        // If the count down is finished, write some text
//        if (distance < 0) {
//            clearInterval(startTimeInterval);
//            started = true;
//            $("#start-container").remove();
//            refreshData()
//        }
//    }, 1000, 1);
//}

function updateBuyPrice(busd) {
    if (busd == undefined || !busd) {
        busd = document.getElementById('busd-spend').value;
    }
    contract.methods.calculateEggBuySimple(web3.utils.toWei(busd)).call().then(eggs => {
        $("#eggs-to-buy").html(parseFloat(eggs/eggstohatch1).toFixed(2));
    });
}

function approve(_amount) {
    let amt;
    if (_amount != 0) {
        amt = +spend + +_amount;
    }
    else {
        amt = 0
    }
    let _spend = web3.utils.toWei(amt.toString())
    tokenContract.methods.approve(minerAddress, _spend).send({ from: currentAddr }).then(result => {
        if (result) {
            $('#busd-spend').attr('disabled', false);
            $('#buy-eggs-btn').attr('disabled', false);
            $('#buy-eggs-btn').attr('value', "10");
            refreshData();
        }

    }).catch((err)=> {
        console.log(err)
    });
}

function approveMiner() {
    let spendDoc = document.getElementById("approve-spend");
    let _amount = spendDoc.value;
    approve(_amount);
}

function buyEggs(){
    var spendDoc = document.getElementById('busd-spend')
    var busd = spendDoc.value;

    var amt = web3.utils.toWei(busd);
	if(+amt + +totalDeposits > +maxDeposit) {
		alert(`you cannot deposit more than ${readableBUSD(maxDeposit, 2)} BUSD`);
        return
    }
	var amt = web3.utils.toWei(busd);
	if(+amt < +minDeposit) {
		alert(`you cannot deposit less than ${readableBUSD(minDeposit, 2)} BUSD`);
        return
    }
    if(+amt > usrBal) {
		alert("you do not have " + busd + " BUSD in your wallet");
        return
    }
    if (+spend < +busd) {
        var amtToSpend = busd - spend;
        alert("you first need to approve " + amtToSpend + " BUSD before depositing");
        return
    }

    let ref = getQueryVariable('ref');
    if (busd > 0) {
        if (!web3.utils.isAddress(ref)) { ref = currentAddr }
        contract.methods.buyEggs(ref, amt).send({ from: currentAddr }).then(result => {
            refreshData()
        }).catch((err) => {
            console.log(err)
        });
    }
}

function hatchEggs(){
    if (canSell) {
        canSell = false;
        console.log(currentAddr)
        contract.methods.hatchEggs(true).send({ from: currentAddr}).then(result => {
            refreshData()
        }).catch((err) => {
            console.log(err)
        });
        setTimeout(function(){
            canSell = true;
        },10000);
    } else {
        console.log('Cannot hatch yet...')
    }
}

function sellEggs(){
    if (canSell) {
        canSell = false;
        console.log('Selling');
        contract.methods.sellEggs().send({ from: currentAddr }).then(result => {
            refreshData()
        }).catch((err) => {
            console.log(err)
        });
        setTimeout(function(){
            canSell = true;
        },10000);
    } else {
        console.log('Cannot sell yet...')
    }
}

function getBalance(callback){
    contract.methods.getBalance().call().then(result => {
        callback(result);
    }).catch((err) => {
        console.log(err)
    });
}

function tokenPrice(callback) {
	const url = "https://api.coingecko.com/api/v3/simple/price?ids=binanceusd&vs_currencies=usd";
	httpGetAsync(url,callback);
}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
}

function readableBUSD(amount, decimals) {
  return (amount / 1e18).toFixed(decimals);
}
