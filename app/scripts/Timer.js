class Timer {
  constructor () {
    const seconds = 30
    const percentage = 612
    let currentPercentage = percentage

    const timer = setInterval(() => {
      currentPercentage -= percentage / seconds
      $('.circle').css('stroke-dashoffset', currentPercentage)
    }, 1000)
  }
}

export default Timer
