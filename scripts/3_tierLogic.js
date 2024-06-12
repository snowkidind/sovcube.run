let currentGlobalTier = 1
let totalRewardsEarned = 0
let totalCumulativeTimelocked = 0

const getRewardRatioForTier = (tier) => {
  if (tier == 1) return 1 * 100000000
  if (tier == 2) return 0.5 * 100000000
  if (tier == 3) return 0.25 * 100000000
  if (tier == 4) return 0.125 * 100000000
  if (tier == 5) return 0.0625 * 100000000
  if (tier == 6) return 0.03125 * 100000000
  if (tier == 7) return 0.015625 * 100000000
  if (tier == 8) return 0.0078125 * 100000000
  if (tier == 9) return 0.00390625 * 100000000
  if (tier == 10) return 0.00390625 * 100000000
  return 0
}

const calculateAndSendRewardsAfterTimelock = (user, amountTimelocked) => {

  if (amountTimelocked >= 14500000000000) throw 'Too much'
  const totalRewards = totalRewardsEarned
  const currentTier = currentGlobalTier
  let totalCumulative = totalCumulativeTimelocked
  totalCumulative += amountTimelocked
  totalCumulativeTimelocked = totalCumulative

  if (totalRewards >= 30000000000000) {
    console.log('Transaction should fail here')
    return
  }

  let newlyEarnedRewards = 0
  let nextTierThreshold = currentTier * 15000000000000

  // if not above thresh nor tier is maxxed
  if (totalCumulative < nextTierThreshold || currentTier == 10) {
    let rewardRatio = getRewardRatioForTier(currentTier)
    newlyEarnedRewards = (amountTimelocked * rewardRatio) / 100000000
  } else {

    console.log('pipeB')
    let amountInCurrentTier = nextTierThreshold - (totalCumulative - amountTimelocked)
    let rewardRatioCurrent = getRewardRatioForTier(currentTier)
    newlyEarnedRewards = (amountInCurrentTier * rewardRatioCurrent) / 100000000

    // Move to the next tier and calculate rewards for the remaining amount in the next tier
    currentGlobalTier++

    let amountInNextTier = amountTimelocked - amountInCurrentTier
    let rewardRatioNext = getRewardRatioForTier(currentGlobalTier)
    newlyEarnedRewards += (amountInNextTier * rewardRatioNext) / 100000000
  }

  // the final depositor may stake but is subject to whatever rate remains in the pool at this time
  if (totalRewards + newlyEarnedRewards > 30000000000000) {
    newlyEarnedRewards = 30000000000000 - totalRewards
  }

  totalRewardsEarned += newlyEarnedRewards
  console.log('ner:', newlyEarnedRewards, 'cgt:', currentGlobalTier, 'tre:', totalRewardsEarned, 'tct:', totalCumulativeTimelocked)
}

const run = () => {

  const rewardRatio = getRewardRatioForTier(currentGlobalTier)
  console.log('hi', rewardRatio)

  for (let i = 0; i < 210; i++) {
    const amountTimeLocked = 14500000000000 / 10
    calculateAndSendRewardsAfterTimelock('nobody', amountTimeLocked)
  }



}


  ; (async () => {
    try {
      await run()
    } catch (error) {
      console.log(error)
    }
  })()